import pLimit from 'p-limit'
import { ObjectId } from 'mongodb'
import axios from 'axios'

interface PipelineOptions {
  fetchConcurrency: number
  processConcurrency: number
  dbConcurrency: number
  dbBatchSize: number
  rateLimit: number
}

interface SetData {
  set: any
  products: any[]
  prices: any[]
}

interface ProcessedData {
  newProducts: any[]
  updatedProducts: Array<{ id: string; data: any }>
  productsToMigrate: Array<{
    id: string
    currentSetId: string
    newSetId: string
    tcgcsvId: number
    name: string
  }>
}

interface GameGroupsData {
  game: any
  groups: any[]
}

export class ConcurrentPipeline<T = SetData> {
  private fetchQueue: Array<() => Promise<T>> = []
  private processQueue: Array<{ data: T; task: () => Promise<ProcessedData> }> = []
  private dbNewQueue: any[] = []
  private dbUpdateQueue: Array<{ id: string; data: any }> = []
  private migrationQueue: Array<{
    id: string
    currentSetId: string
    newSetId: string
    tcgcsvId: number
    name: string
  }> = []

  private activeFetchers = 0
  private activeProcessors = 0
  private activeDbWriters = 0

  private tokens: number
  private lastRefill: number
  private readonly refillMs: number

  private processCallback: ((data: T) => Promise<ProcessedData>) | null = null
  private context: any = null
  private startTime = 0

  private totalTasks = 0
  private completedTasks = 0
  private taskAdditionComplete = false
  private taskAdditionResolver: ((value?: void | PromiseLike<void>) => void) | null = null
  private completionResolver: ((value?: void | PromiseLike<void>) => void) | null = null
  private completionPromise: Promise<void> = Promise.resolve()

  private fetchLimiter: any
  private processLimiter: any
  private dbLimiter: any

  constructor(private options: PipelineOptions) {
    this.fetchLimiter = pLimit(options.fetchConcurrency)
    this.processLimiter = pLimit(options.processConcurrency)
    this.dbLimiter = pLimit(options.dbConcurrency)

    this.tokens = options.rateLimit
    this.lastRefill = Date.now()
    this.refillMs = 1000 / options.rateLimit
  }

  setContext(context: any): void {
    this.context = context
  }

  onProcess(callback: (data: T) => Promise<ProcessedData>): void {
    this.processCallback = callback
  }

  addFetchTask(task: () => Promise<T>): void {
    this.totalTasks++
    this.fetchQueue.push(task)
  }

  signalTaskAdditionComplete(): void {
    this.taskAdditionComplete = true
    if (this.taskAdditionResolver) {
      this.taskAdditionResolver()
      this.taskAdditionResolver = null
    }
  }

  async run(): Promise<void> {
    this.startTime = Date.now()

    this.completionPromise = new Promise<void>((resolve) => {
      this.completionResolver = resolve
    })

    this.signalTaskAdditionComplete()

    const fetchPromises = []
    for (let i = 0; i < this.options.fetchConcurrency; i++) {
      fetchPromises.push(this.fetchWorker())
    }

    await Promise.all(fetchPromises)

    const totalDuration = Date.now() - this.startTime
  }

  private async acquireToken(): Promise<void> {
    let now = Date.now()
    let elapsed = now - this.lastRefill

    if (elapsed >= this.refillMs) {
      this.tokens = Math.min(this.options.rateLimit, Math.floor(elapsed / this.refillMs) + this.tokens)
      this.lastRefill = now
    }

    while (this.tokens <= 0) {
      await new Promise((resolve) => setTimeout(resolve, this.refillMs))
      now = Date.now()
      elapsed = now - this.lastRefill
      if (elapsed >= this.refillMs) {
        this.tokens = Math.min(this.options.rateLimit, Math.floor(elapsed / this.refillMs) + this.tokens)
        this.lastRefill = now
      }
    }

    this.tokens--
  }

  private async fetchWorker(): Promise<void> {
    while (true) {
      const task = this.fetchQueue.shift()

      if (!task) {
        if (!this.taskAdditionComplete) {
          await new Promise((resolve) => {
            this.taskAdditionResolver = resolve
          })
          continue
        }

        if (this.completedTasks >= this.totalTasks) {
          break
        }

        if (this.activeFetchers > 0) {
          await this.completionPromise
          continue
        }

        await new Promise((resolve) => setTimeout(resolve, 10))
        continue
      }

      await this.fetchLimiter(async () => {
        this.activeFetchers++
        try {
          await this.acquireToken()
          
          let result: T | null = null
          try {
            result = await task()
          } catch (taskError: any) {
            console.error(`[pipeline] Task execution failed:`, taskError.message || taskError)
            // Log additional details if it's an Axios error
            if (taskError.response) {
              console.error(`[pipeline] HTTP ${taskError.response.status}: ${taskError.config?.url}`)
            }
            // Swallow the error to keep worker alive and continue processing
            result = null
          }

          if (result && this.processCallback) {
            const processedData = await this.processCallback(result)

            this.dbNewQueue.push(...processedData.newProducts)
            this.dbUpdateQueue.push(...processedData.updatedProducts)
            this.migrationQueue.push(...processedData.productsToMigrate)

            this.startDbWriter()

            if (
              this.dbNewQueue.length >= this.options.dbBatchSize ||
              this.dbUpdateQueue.length >= this.options.dbBatchSize
            ) {
              await this.commitDbBatch()
            }
          }
        } finally {
          this.activeFetchers--
          this.completedTasks++

          if (this.completionResolver && this.completedTasks >= this.totalTasks) {
            this.completionResolver()
            this.completionResolver = null
          }
        }
      })
    }
  }

  private startProcessor(): void {
    while (this.processQueue.length > 0 && this.activeProcessors < this.options.processConcurrency) {
      const item = this.processQueue.shift()
      if (!item) continue

      this.activeProcessors++

      this.processLimiter(async () => {
        try {
          const result = await item.task()

          this.dbNewQueue.push(...result.newProducts)
          this.dbUpdateQueue.push(...result.updatedProducts)
          this.migrationQueue.push(...result.productsToMigrate)

          this.startDbWriter()

          if (
            this.dbNewQueue.length >= this.options.dbBatchSize ||
            this.dbUpdateQueue.length >= this.options.dbBatchSize
          ) {
            await this.commitDbBatch()
          }
        } catch (error) {
          console.error(`[pipeline] Process error:`, error)
        } finally {
          this.activeProcessors--
          this.startProcessor()
        }
      })
    }
  }

  private startDbWriter(): void {
    while (
      (this.dbNewQueue.length >= this.options.dbBatchSize ||
        this.dbUpdateQueue.length >= this.options.dbBatchSize) &&
      this.activeDbWriters < this.options.dbConcurrency
    ) {
      this.activeDbWriters++

      this.dbLimiter(async () => {
        await this.commitDbBatch()
        this.activeDbWriters--
      })
    }
  }

  private async commitDbBatch(): Promise<void> {
    if (this.dbNewQueue.length === 0 && this.dbUpdateQueue.length === 0 && this.migrationQueue.length === 0) {
      return
    }

    try {
      if (!this.context) {
        return
      }

      const productsCollection = await this.context.app.service('products').getModel()

      if (this.dbNewQueue.length > 0) {
        const batch = this.dbNewQueue.splice(0, this.options.dbBatchSize)
        try {
          await productsCollection.insertMany(batch as any, { ordered: false })
        } catch (error: any) {
          if (error.code === 11000) {
            // Gracefully handle duplicate key errors
            const successCount = error.result?.insertedCount || 0
            const failCount = batch.length - successCount
            console.log(
              `[pipeline] Insert batch partially completed: ${successCount} inserted, ${failCount} duplicates skipped`
            )

            // Log the first few duplicates for debugging
            if (error.writeErrors && error.writeErrors.length > 0) {
              const sampleErrors = error.writeErrors.slice(0, 3)
              console.log(`[pipeline] Sample duplicate keys:`)
              sampleErrors.forEach((err: any) => {
                const doc = batch[err.index]
                if (doc) {
                  console.log(
                    `  - tcgcsv_id: ${doc.external_id?.tcgcsv_id}, collector_number: ${doc.collector_number || 'N/A'}, rarity: ${doc.rarity || 'N/A'}, print: ${doc.print || 'N/A'}, finish: ${doc.finish || 'N/A'}`
                  )
                }
              })
              if (error.writeErrors.length > 3) {
                console.log(`  ... and ${error.writeErrors.length - 3} more duplicates`)
              }
            }
            // Don't throw - we want to continue processing
            return
          }
          throw error
        }
      }

      if (this.dbUpdateQueue.length > 0) {
        const batch = this.dbUpdateQueue.splice(0, this.options.dbBatchSize)

        const operations = batch.map(({ id, data }: { id: string; data: any }) => ({
          updateOne: {
            filter: { _id: new ObjectId(id) },
            update: { $set: data }
          }
        }))

        try {
          await productsCollection.bulkWrite(operations, { ordered: false })
        } catch (error: any) {
          if (error.code === 11000) {
            // Gracefully handle duplicate key errors in updates
            const successCount = error.result?.modifiedCount || 0
            const matchedCount = error.result?.matchedCount || 0
            console.log(
              `[pipeline] Update batch partially completed: ${matchedCount} matched, ${successCount} modified`
            )

            // Log the first few duplicates for debugging
            if (error.writeErrors && error.writeErrors.length > 0) {
              const sampleErrors = error.writeErrors.slice(0, 3)
              console.log(`[pipeline] Sample update conflicts:`)
              sampleErrors.forEach((err: any) => {
                const operation = batch[err.index]
                if (operation) {
                  console.log(`  - Document ID: ${operation.id}, attempted update caused duplicate key`)
                }
              })
              if (error.writeErrors.length > 3) {
                console.log(`  ... and ${error.writeErrors.length - 3} more conflicts`)
              }
            }
            // Don't throw - we want to continue processing
            return
          }
          throw error
        }
      }

      if (this.migrationQueue.length > 0) {
        const batch = this.migrationQueue.splice(0, 100)

        for (const migration of batch) {
          try {
            await this.context.app.service('products').patch(migration.id, {
              set_id: new ObjectId(migration.newSetId)
            })
          } catch (err) {
            console.error(`[pipeline] Error migrating product ${migration.id}:`, err)
          }
        }
      }
    } catch (error) {
      console.error(`[pipeline] DB commit error:`, error)
    }
  }

  async drain(): Promise<void> {
    while (
      this.fetchQueue.length > 0 ||
      this.activeFetchers > 0 ||
      this.processQueue.length > 0 ||
      this.activeProcessors > 0 ||
      this.dbNewQueue.length > 0 ||
      this.dbUpdateQueue.length > 0 ||
      this.migrationQueue.length > 0 ||
      this.activeDbWriters > 0
    ) {
      await this.commitDbBatch()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

export function createRateLimitedAxios(rateLimit: number) {
  const tokens: number[] = []
  const refillMs = 1000 / rateLimit

  const acquireToken = async (): Promise<void> => {
    const now = Date.now()

    while (tokens.length >= rateLimit) {
      const oldest = tokens[0]
      const wait = Math.max(0, refillMs - (now - oldest))
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait))
      }
      tokens.shift()
    }

    tokens.push(Date.now())
  }

  return {
    get: async <T>(url: string, opts?: any): Promise<T> => {
      await acquireToken()
      const response = await axios.get(url, opts)
      return response.data as T
    }
  }
}
