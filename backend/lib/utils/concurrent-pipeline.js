"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcurrentPipeline = void 0;
exports.createRateLimitedAxios = createRateLimitedAxios;
const p_limit_1 = __importDefault(require("p-limit"));
const mongodb_1 = require("mongodb");
const axios_1 = __importDefault(require("axios"));
class ConcurrentPipeline {
    constructor(options) {
        this.options = options;
        this.fetchQueue = [];
        this.processQueue = [];
        this.dbNewQueue = [];
        this.dbUpdateQueue = [];
        this.migrationQueue = [];
        this.activeFetchers = 0;
        this.activeProcessors = 0;
        this.activeDbWriters = 0;
        this.processCallback = null;
        this.context = null;
        this.startTime = 0;
        this.totalTasks = 0;
        this.completedTasks = 0;
        this.taskAdditionComplete = false;
        this.taskAdditionResolver = null;
        this.completionResolver = null;
        this.completionPromise = Promise.resolve();
        this.fetchLimiter = (0, p_limit_1.default)(options.fetchConcurrency);
        this.processLimiter = (0, p_limit_1.default)(options.processConcurrency);
        this.dbLimiter = (0, p_limit_1.default)(options.dbConcurrency);
        this.tokens = options.rateLimit;
        this.lastRefill = Date.now();
        this.refillMs = 1000 / options.rateLimit;
    }
    setContext(context) {
        this.context = context;
    }
    onProcess(callback) {
        this.processCallback = callback;
    }
    addFetchTask(task) {
        this.totalTasks++;
        this.fetchQueue.push(task);
    }
    signalTaskAdditionComplete() {
        this.taskAdditionComplete = true;
        if (this.taskAdditionResolver) {
            this.taskAdditionResolver();
            this.taskAdditionResolver = null;
        }
    }
    async run() {
        this.startTime = Date.now();
        this.completionPromise = new Promise((resolve) => {
            this.completionResolver = resolve;
        });
        this.signalTaskAdditionComplete();
        const fetchPromises = [];
        for (let i = 0; i < this.options.fetchConcurrency; i++) {
            fetchPromises.push(this.fetchWorker());
        }
        await Promise.all(fetchPromises);
        const totalDuration = Date.now() - this.startTime;
    }
    async acquireToken() {
        let now = Date.now();
        let elapsed = now - this.lastRefill;
        if (elapsed >= this.refillMs) {
            this.tokens = Math.min(this.options.rateLimit, Math.floor(elapsed / this.refillMs) + this.tokens);
            this.lastRefill = now;
        }
        while (this.tokens <= 0) {
            await new Promise((resolve) => setTimeout(resolve, this.refillMs));
            now = Date.now();
            elapsed = now - this.lastRefill;
            if (elapsed >= this.refillMs) {
                this.tokens = Math.min(this.options.rateLimit, Math.floor(elapsed / this.refillMs) + this.tokens);
                this.lastRefill = now;
            }
        }
        this.tokens--;
    }
    async fetchWorker() {
        while (true) {
            const task = this.fetchQueue.shift();
            if (!task) {
                if (!this.taskAdditionComplete) {
                    await new Promise((resolve) => {
                        this.taskAdditionResolver = resolve;
                    });
                    continue;
                }
                if (this.completedTasks >= this.totalTasks) {
                    break;
                }
                if (this.activeFetchers > 0) {
                    await this.completionPromise;
                    continue;
                }
                await new Promise((resolve) => setTimeout(resolve, 10));
                continue;
            }
            await this.fetchLimiter(async () => {
                this.activeFetchers++;
                try {
                    await this.acquireToken();
                    const result = await task();
                    if (result && this.processCallback) {
                        const processedData = await this.processCallback(result);
                        this.dbNewQueue.push(...processedData.newProducts);
                        this.dbUpdateQueue.push(...processedData.updatedProducts);
                        this.migrationQueue.push(...processedData.productsToMigrate);
                        this.startDbWriter();
                        if (this.dbNewQueue.length >= this.options.dbBatchSize ||
                            this.dbUpdateQueue.length >= this.options.dbBatchSize) {
                            await this.commitDbBatch();
                        }
                    }
                }
                finally {
                    this.activeFetchers--;
                    this.completedTasks++;
                    if (this.completionResolver && this.completedTasks >= this.totalTasks) {
                        this.completionResolver();
                        this.completionResolver = null;
                    }
                }
            });
        }
    }
    startProcessor() {
        while (this.processQueue.length > 0 && this.activeProcessors < this.options.processConcurrency) {
            const item = this.processQueue.shift();
            if (!item)
                continue;
            this.activeProcessors++;
            this.processLimiter(async () => {
                try {
                    const result = await item.task();
                    this.dbNewQueue.push(...result.newProducts);
                    this.dbUpdateQueue.push(...result.updatedProducts);
                    this.migrationQueue.push(...result.productsToMigrate);
                    this.startDbWriter();
                    if (this.dbNewQueue.length >= this.options.dbBatchSize ||
                        this.dbUpdateQueue.length >= this.options.dbBatchSize) {
                        await this.commitDbBatch();
                    }
                }
                catch (error) {
                    console.error(`[pipeline] Process error:`, error);
                }
                finally {
                    this.activeProcessors--;
                    this.startProcessor();
                }
            });
        }
    }
    startDbWriter() {
        while ((this.dbNewQueue.length >= this.options.dbBatchSize ||
            this.dbUpdateQueue.length >= this.options.dbBatchSize) &&
            this.activeDbWriters < this.options.dbConcurrency) {
            this.activeDbWriters++;
            this.dbLimiter(async () => {
                await this.commitDbBatch();
                this.activeDbWriters--;
            });
        }
    }
    async commitDbBatch() {
        if (this.dbNewQueue.length === 0 && this.dbUpdateQueue.length === 0 && this.migrationQueue.length === 0) {
            return;
        }
        try {
            if (!this.context) {
                return;
            }
            const productsCollection = await this.context.app.service('products').getModel();
            if (this.dbNewQueue.length > 0) {
                const batch = this.dbNewQueue.splice(0, this.options.dbBatchSize);
                try {
                    await productsCollection.insertMany(batch, { ordered: false });
                }
                catch (error) {
                    if (error.code === 11000) {
                        // Gracefully handle duplicate key errors
                        const successCount = error.result?.insertedCount || 0;
                        const failCount = batch.length - successCount;
                        console.log(`[pipeline] Insert batch partially completed: ${successCount} inserted, ${failCount} duplicates skipped`);
                        // Log the first few duplicates for debugging
                        if (error.writeErrors && error.writeErrors.length > 0) {
                            const sampleErrors = error.writeErrors.slice(0, 3);
                            console.log(`[pipeline] Sample duplicate keys:`);
                            sampleErrors.forEach((err) => {
                                const doc = batch[err.index];
                                if (doc) {
                                    console.log(`  - tcgcsv_id: ${doc.external_id?.tcgcsv_id}, collector_number: ${doc.collector_number || 'N/A'}, rarity: ${doc.rarity || 'N/A'}, print: ${doc.print || 'N/A'}, finish: ${doc.finish || 'N/A'}`);
                                }
                            });
                            if (error.writeErrors.length > 3) {
                                console.log(`  ... and ${error.writeErrors.length - 3} more duplicates`);
                            }
                        }
                        // Don't throw - we want to continue processing
                        return;
                    }
                    throw error;
                }
            }
            if (this.dbUpdateQueue.length > 0) {
                const batch = this.dbUpdateQueue.splice(0, this.options.dbBatchSize);
                const operations = batch.map(({ id, data }) => ({
                    updateOne: {
                        filter: { _id: new mongodb_1.ObjectId(id) },
                        update: { $set: data }
                    }
                }));
                try {
                    await productsCollection.bulkWrite(operations, { ordered: false });
                }
                catch (error) {
                    if (error.code === 11000) {
                        // Gracefully handle duplicate key errors in updates
                        const successCount = error.result?.modifiedCount || 0;
                        const matchedCount = error.result?.matchedCount || 0;
                        console.log(`[pipeline] Update batch partially completed: ${matchedCount} matched, ${successCount} modified`);
                        // Log the first few duplicates for debugging
                        if (error.writeErrors && error.writeErrors.length > 0) {
                            const sampleErrors = error.writeErrors.slice(0, 3);
                            console.log(`[pipeline] Sample update conflicts:`);
                            sampleErrors.forEach((err) => {
                                const operation = batch[err.index];
                                if (operation) {
                                    console.log(`  - Document ID: ${operation.id}, attempted update caused duplicate key`);
                                }
                            });
                            if (error.writeErrors.length > 3) {
                                console.log(`  ... and ${error.writeErrors.length - 3} more conflicts`);
                            }
                        }
                        // Don't throw - we want to continue processing
                        return;
                    }
                    throw error;
                }
            }
            if (this.migrationQueue.length > 0) {
                const batch = this.migrationQueue.splice(0, 100);
                for (const migration of batch) {
                    try {
                        await this.context.app.service('products').patch(migration.id, {
                            set_id: new mongodb_1.ObjectId(migration.newSetId)
                        });
                    }
                    catch (err) {
                        console.error(`[pipeline] Error migrating product ${migration.id}:`, err);
                    }
                }
            }
        }
        catch (error) {
            console.error(`[pipeline] DB commit error:`, error);
        }
    }
    async drain() {
        while (this.fetchQueue.length > 0 ||
            this.activeFetchers > 0 ||
            this.processQueue.length > 0 ||
            this.activeProcessors > 0 ||
            this.dbNewQueue.length > 0 ||
            this.dbUpdateQueue.length > 0 ||
            this.migrationQueue.length > 0 ||
            this.activeDbWriters > 0) {
            await this.commitDbBatch();
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}
exports.ConcurrentPipeline = ConcurrentPipeline;
function createRateLimitedAxios(rateLimit) {
    const tokens = [];
    const refillMs = 1000 / rateLimit;
    const acquireToken = async () => {
        const now = Date.now();
        while (tokens.length >= rateLimit) {
            const oldest = tokens[0];
            const wait = Math.max(0, refillMs - (now - oldest));
            if (wait > 0) {
                await new Promise((resolve) => setTimeout(resolve, wait));
            }
            tokens.shift();
        }
        tokens.push(Date.now());
    };
    return {
        get: async (url, opts) => {
            await acquireToken();
            const response = await axios_1.default.get(url, opts);
            return response.data;
        }
    };
}
//# sourceMappingURL=concurrent-pipeline.js.map