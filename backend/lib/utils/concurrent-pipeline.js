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
    async run() {
        this.startTime = Date.now();
        console.log(`[pipeline] Starting with fetchConcurrency=${this.options.fetchConcurrency}, processConcurrency=${this.options.processConcurrency}, dbConcurrency=${this.options.dbConcurrency}, rateLimit=${this.options.rateLimit}/s, dbBatchSize=${this.options.dbBatchSize}`);
        const fetchPromises = [];
        for (let i = 0; i < this.options.fetchConcurrency; i++) {
            fetchPromises.push(this.fetchWorker());
        }
        await Promise.all(fetchPromises);
        console.log(`[pipeline] All fetches complete. processQueue: ${this.processQueue.length}, activeFetchers: ${this.activeFetchers}`);
        const totalDuration = Date.now() - this.startTime;
        console.log(`[pipeline] Completed in ${totalDuration}ms`);
    }
    async acquireToken() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        if (elapsed >= this.refillMs) {
            this.tokens = Math.min(this.options.rateLimit, Math.floor(elapsed / this.refillMs) + this.tokens);
            this.lastRefill = now;
        }
        while (this.tokens <= 0) {
            await new Promise(resolve => setTimeout(resolve, this.refillMs));
            const elapsed = now - this.lastRefill;
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
                await new Promise(resolve => setTimeout(resolve, 10));
                if (this.completedTasks >= this.totalTasks) {
                    break;
                }
                continue;
            }
            await this.fetchLimiter(async () => {
                this.activeFetchers++;
                try {
                    await this.acquireToken();
                    await task();
                }
                finally {
                    this.activeFetchers--;
                    this.completedTasks++;
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
                    if (this.dbNewQueue.length >= this.options.dbBatchSize || this.dbUpdateQueue.length >= this.options.dbBatchSize) {
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
        while ((this.dbNewQueue.length >= this.options.dbBatchSize || this.dbUpdateQueue.length >= this.options.dbBatchSize) && this.activeDbWriters < this.options.dbConcurrency) {
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
                console.warn(`[pipeline] No context set, skipping DB commit`);
                return;
            }
            const productsCollection = await this.context.app.service('products').getModel();
            if (this.dbNewQueue.length > 0) {
                const batch = this.dbNewQueue.splice(0, this.options.dbBatchSize);
                console.log(`[pipeline] DB: Inserting ${batch.length} new products`);
                await productsCollection.insertMany(batch, { ordered: false });
            }
            if (this.dbUpdateQueue.length > 0) {
                const batch = this.dbUpdateQueue.splice(0, this.options.dbBatchSize);
                console.log(`[pipeline] DB: Updating ${batch.length} products`);
                const operations = batch.map(({ id, data }) => ({
                    updateOne: {
                        filter: { _id: new mongodb_1.ObjectId(id) },
                        update: { $set: data }
                    }
                }));
                await productsCollection.bulkWrite(operations, { ordered: false });
            }
            if (this.migrationQueue.length > 0) {
                const batch = this.migrationQueue.splice(0, 100);
                console.log(`[pipeline] DB: Migrating ${batch.length} products between sets`);
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
        console.log(`[pipeline] Draining remaining items...`);
        while (this.fetchQueue.length > 0 ||
            this.activeFetchers > 0 ||
            this.processQueue.length > 0 ||
            this.activeProcessors > 0 ||
            this.dbNewQueue.length > 0 ||
            this.dbUpdateQueue.length > 0 ||
            this.migrationQueue.length > 0 ||
            this.activeDbWriters > 0) {
            await this.commitDbBatch();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(`[pipeline] Drain complete`);
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
                await new Promise(resolve => setTimeout(resolve, wait));
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