/**
 * @deprecated This module is deprecated. Use ConcurrentPipeline from concurrent-pipeline.ts instead.
 * ConcurrentPipeline provides true concurrent processing with separate fetch, process, and DB stages.
 * See backend/src/utils/concurrent-pipeline.ts for the new implementation.
 */
interface StreamQueueOptions {
  concurrency: number
  rateLimit?: number
  rateWindowMs?: number
  logProgressEvery?: number
}
interface StreamQueueStats {
  totalAdded: number
  totalCompleted: number
  totalErrors: number
  totalDuration: number
}
export declare class StreamQueue<T> {
  private queue
  private results
  private errors
  private limit
  private rateLimiter
  private stats
  private startTime
  private logProgressEvery
  private processedCallback
  constructor(options: StreamQueueOptions)
  private createRateLimiter
  add(id: string, task: () => Promise<T>): void
  onProcessed(callback: (item: T, duration: number) => Promise<void>): void
  process(): Promise<{
    results: T[]
    errors: Array<{
      id: string
      error: unknown
      timestamp: number
    }>
    stats: StreamQueueStats
  }>
  drain(): Promise<void>
  getStats(): StreamQueueStats
  getErrors(): Array<{
    id: string
    error: unknown
    timestamp: number
  }>
  getResults(): T[]
}
interface RateLimitedFetcherOptions {
  rateLimit: number
  windowMs?: number
}
interface RateLimitedFetcherStats {
  total: number
  lastSecond: number
  peak: number
}
export declare function createRateLimitedFetch(options: RateLimitedFetcherOptions): {
  fetch: <T>(url: string, opts?: any) => Promise<T>
  getStats: () => RateLimitedFetcherStats
}
export declare function createRateLimitedFetchWithAxios(
  rateLimit: number,
  windowMs?: number
): {
  fetch: <T>(url: string, opts?: any) => Promise<T>
  getStats: () => {
    total: number
    lastSecond: number
    peak: number
  }
}
export {}
