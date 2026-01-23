import pLimit from 'p-limit'
import axios from 'axios'

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

interface QueueItem<T> {
  id: string
  task: () => Promise<T>
}

interface StreamQueueStats {
  totalAdded: number
  totalCompleted: number
  totalErrors: number
  totalDuration: number
}

export class StreamQueue<T> {
  private queue: QueueItem<T>[] = []
  private results: T[] = []
  private errors: Array<{ id: string; error: unknown; timestamp: number }> = []
  private limit: any
  private rateLimiter: (() => Promise<void>) | null = null
  private stats: StreamQueueStats = {
    totalAdded: 0,
    totalCompleted: 0,
    totalErrors: 0,
    totalDuration: 0
  }
  private startTime: number = 0
  private logProgressEvery: number
  private processedCallback: ((item: T, duration: number) => Promise<void>) | null = null

  constructor(options: StreamQueueOptions) {
    this.limit = pLimit(options.concurrency)
    this.logProgressEvery = options.logProgressEvery ?? 50

    if (options.rateLimit && options.rateLimit > 0) {
      this.rateLimiter = this.createRateLimiter(options.rateLimit, options.rateWindowMs ?? 1000)
    }
  }

  private createRateLimiter(rateLimit: number, windowMs: number): () => Promise<void> {
    const timestamps: number[] = []

    return async () => {
      const now = Date.now()

      while (timestamps.length && now - timestamps[0] >= windowMs) {
        timestamps.shift()
      }

      if (timestamps.length >= rateLimit) {
        const waitTime = windowMs - (now - timestamps[0]) + 2
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }

      timestamps.push(now)
    }
  }

  add(id: string, task: () => Promise<T>): void {
    this.queue.push({ id, task })
    this.stats.totalAdded++
  }

  onProcessed(callback: (item: T, duration: number) => Promise<void>): void {
    this.processedCallback = callback
  }

  async process(): Promise<{
    results: T[]
    errors: Array<{ id: string; error: unknown; timestamp: number }>
    stats: StreamQueueStats
  }> {
    this.startTime = Date.now()

    console.log(
      `[stream] Starting processing ${this.queue.length} items with concurrency ${(this.limit as any).concurrency ?? 'unlimited'}`
    )

    const processingPromises = this.queue.map(async (item) => {
      return this.limit(async () => {
        const itemStartTime = Date.now()

        if (this.rateLimiter) {
          await this.rateLimiter()
        }

        try {
          const result = await item.task()
          const duration = Date.now() - itemStartTime

          this.results.push(result)
          this.stats.totalCompleted++

          if (this.processedCallback) {
            await this.processedCallback(result, duration)
          }

          if (this.stats.totalCompleted % this.logProgressEvery === 0) {
            const elapsed = Date.now() - this.startTime
            const rate = this.stats.totalCompleted / (elapsed / 1000)
            console.log(
              `[stream] Progress: ${this.stats.totalCompleted}/${this.queue.length} completed (${rate.toFixed(2)}/s), ${this.errors.length} errors`
            )
          }

          return result
        } catch (error) {
          const duration = Date.now() - itemStartTime
          this.errors.push({ id: item.id, error, timestamp: Date.now() })
          this.stats.totalErrors++
          console.error(`[stream] Error processing item ${item.id}:`, error)
          return null
        }
      })
    })

    await Promise.all(processingPromises)

    this.stats.totalDuration = Date.now() - this.startTime

    console.log(
      `[stream] Completed processing. Total: ${this.stats.totalCompleted}, Errors: ${this.stats.totalErrors}, Duration: ${this.stats.totalDuration}ms`
    )

    return {
      results: this.results,
      errors: this.errors,
      stats: this.stats
    }
  }

  async drain(): Promise<void> {
    while (this.queue.length > 0) {
      await this.process()
    }
  }

  getStats(): StreamQueueStats {
    return { ...this.stats }
  }

  getErrors(): Array<{ id: string; error: unknown; timestamp: number }> {
    return [...this.errors]
  }

  getResults(): T[] {
    return [...this.results]
  }
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

export function createRateLimitedFetch(options: RateLimitedFetcherOptions): {
  fetch: <T>(url: string, opts?: any) => Promise<T>
  getStats: () => RateLimitedFetcherStats
} {
  const rateLimit = options.rateLimit
  const windowMs = options.windowMs ?? 1000
  const timestamps: number[] = []
  let requestsThisSecond = 0
  let peakRequestsThisSecond = 0
  let totalRequests = 0

  setInterval(() => {
    requestsThisSecond = 0
  }, windowMs)

  const checkRateLimit = async (): Promise<void> => {
    const now = Date.now()

    while (timestamps.length && now - timestamps[0] >= windowMs) {
      timestamps.shift()
    }

    if (timestamps.length >= rateLimit) {
      const waitTime = windowMs - (now - timestamps[0]) + 2
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    timestamps.push(now)
    totalRequests++
    requestsThisSecond++

    if (requestsThisSecond > peakRequestsThisSecond) {
      peakRequestsThisSecond = requestsThisSecond
    }
  }

  return {
    fetch: async <T>(url: string, opts?: any): Promise<T> => {
      await checkRateLimit()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (axios as any).get(url, opts)
      return response.data
    },
    getStats: () => ({
      total: totalRequests,
      lastSecond: requestsThisSecond,
      peak: peakRequestsThisSecond
    })
  }
}

export function createRateLimitedFetchWithAxios(
  rateLimit: number,
  windowMs: number = 1000
): {
  fetch: <T>(url: string, opts?: any) => Promise<T>
  getStats: () => { total: number; lastSecond: number; peak: number }
} {
  const timestamps: number[] = []
  let requestsThisSecond = 0
  let peakRequestsThisSecond = 0
  let totalRequests = 0

  setInterval(() => {
    requestsThisSecond = 0
  }, windowMs)

  const checkRateLimit = async (): Promise<void> => {
    const now = Date.now()

    while (timestamps.length && now - timestamps[0] >= windowMs) {
      timestamps.shift()
    }

    if (timestamps.length >= rateLimit) {
      const waitTime = windowMs - (now - timestamps[0]) + 2
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    timestamps.push(now)
    totalRequests++
    requestsThisSecond++

    if (requestsThisSecond > peakRequestsThisSecond) {
      peakRequestsThisSecond = requestsThisSecond
    }
  }

  return {
    fetch: async <T>(url: string, opts?: any): Promise<T> => {
      await checkRateLimit()
      const response = await axios.get(url, opts)
      return response as T
    },
    getStats: () => ({
      total: totalRequests,
      lastSecond: requestsThisSecond,
      peak: peakRequestsThisSecond
    })
  }
}
