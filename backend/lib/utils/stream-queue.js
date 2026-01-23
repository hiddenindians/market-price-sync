"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamQueue = void 0;
exports.createRateLimitedFetch = createRateLimitedFetch;
exports.createRateLimitedFetchWithAxios = createRateLimitedFetchWithAxios;
const p_limit_1 = __importDefault(require("p-limit"));
const axios_1 = __importDefault(require("axios"));
class StreamQueue {
    constructor(options) {
        this.queue = [];
        this.results = [];
        this.errors = [];
        this.rateLimiter = null;
        this.stats = {
            totalAdded: 0,
            totalCompleted: 0,
            totalErrors: 0,
            totalDuration: 0
        };
        this.startTime = 0;
        this.processedCallback = null;
        this.limit = (0, p_limit_1.default)(options.concurrency);
        this.logProgressEvery = options.logProgressEvery ?? 50;
        if (options.rateLimit && options.rateLimit > 0) {
            this.rateLimiter = this.createRateLimiter(options.rateLimit, options.rateWindowMs ?? 1000);
        }
    }
    createRateLimiter(rateLimit, windowMs) {
        const timestamps = [];
        return async () => {
            const now = Date.now();
            while (timestamps.length && now - timestamps[0] >= windowMs) {
                timestamps.shift();
            }
            if (timestamps.length >= rateLimit) {
                const waitTime = windowMs - (now - timestamps[0]) + 2;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            timestamps.push(now);
        };
    }
    add(id, task) {
        this.queue.push({ id, task });
        this.stats.totalAdded++;
    }
    onProcessed(callback) {
        this.processedCallback = callback;
    }
    async process() {
        this.startTime = Date.now();
        console.log(`[stream] Starting processing ${this.queue.length} items with concurrency ${this.limit.concurrency ?? 'unlimited'}`);
        const processingPromises = this.queue.map(async (item) => {
            return this.limit(async () => {
                const itemStartTime = Date.now();
                if (this.rateLimiter) {
                    await this.rateLimiter();
                }
                try {
                    const result = await item.task();
                    const duration = Date.now() - itemStartTime;
                    this.results.push(result);
                    this.stats.totalCompleted++;
                    if (this.processedCallback) {
                        await this.processedCallback(result, duration);
                    }
                    if (this.stats.totalCompleted % this.logProgressEvery === 0) {
                        const elapsed = Date.now() - this.startTime;
                        const rate = this.stats.totalCompleted / (elapsed / 1000);
                        console.log(`[stream] Progress: ${this.stats.totalCompleted}/${this.queue.length} completed (${rate.toFixed(2)}/s), ${this.errors.length} errors`);
                    }
                    return result;
                }
                catch (error) {
                    const duration = Date.now() - itemStartTime;
                    this.errors.push({ id: item.id, error, timestamp: Date.now() });
                    this.stats.totalErrors++;
                    console.error(`[stream] Error processing item ${item.id}:`, error);
                    return null;
                }
            });
        });
        await Promise.all(processingPromises);
        this.stats.totalDuration = Date.now() - this.startTime;
        console.log(`[stream] Completed processing. Total: ${this.stats.totalCompleted}, Errors: ${this.stats.totalErrors}, Duration: ${this.stats.totalDuration}ms`);
        return {
            results: this.results,
            errors: this.errors,
            stats: this.stats
        };
    }
    async drain() {
        while (this.queue.length > 0) {
            await this.process();
        }
    }
    getStats() {
        return { ...this.stats };
    }
    getErrors() {
        return [...this.errors];
    }
    getResults() {
        return [...this.results];
    }
}
exports.StreamQueue = StreamQueue;
function createRateLimitedFetch(options) {
    const rateLimit = options.rateLimit;
    const windowMs = options.windowMs ?? 1000;
    const timestamps = [];
    let requestsThisSecond = 0;
    let peakRequestsThisSecond = 0;
    let totalRequests = 0;
    setInterval(() => {
        requestsThisSecond = 0;
    }, windowMs);
    const checkRateLimit = async () => {
        const now = Date.now();
        while (timestamps.length && now - timestamps[0] >= windowMs) {
            timestamps.shift();
        }
        if (timestamps.length >= rateLimit) {
            const waitTime = windowMs - (now - timestamps[0]) + 2;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        timestamps.push(now);
        totalRequests++;
        requestsThisSecond++;
        if (requestsThisSecond > peakRequestsThisSecond) {
            peakRequestsThisSecond = requestsThisSecond;
        }
    };
    return {
        fetch: async (url, opts) => {
            await checkRateLimit();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await axios_1.default.get(url, opts);
            return response.data;
        },
        getStats: () => ({
            total: totalRequests,
            lastSecond: requestsThisSecond,
            peak: peakRequestsThisSecond
        })
    };
}
function createRateLimitedFetchWithAxios(rateLimit, windowMs = 1000) {
    const timestamps = [];
    let requestsThisSecond = 0;
    let peakRequestsThisSecond = 0;
    let totalRequests = 0;
    setInterval(() => {
        requestsThisSecond = 0;
    }, windowMs);
    const checkRateLimit = async () => {
        const now = Date.now();
        while (timestamps.length && now - timestamps[0] >= windowMs) {
            timestamps.shift();
        }
        if (timestamps.length >= rateLimit) {
            const waitTime = windowMs - (now - timestamps[0]) + 2;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        timestamps.push(now);
        totalRequests++;
        requestsThisSecond++;
        if (requestsThisSecond > peakRequestsThisSecond) {
            peakRequestsThisSecond = requestsThisSecond;
        }
    };
    return {
        fetch: async (url, opts) => {
            await checkRateLimit();
            const response = await axios_1.default.get(url, opts);
            return response;
        },
        getStats: () => ({
            total: totalRequests,
            lastSecond: requestsThisSecond,
            peak: peakRequestsThisSecond
        })
    };
}
//# sourceMappingURL=stream-queue.js.map