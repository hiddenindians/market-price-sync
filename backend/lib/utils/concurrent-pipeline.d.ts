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
  updatedProducts: Array<{
    id: string
    data: any
  }>
  productsToMigrate: Array<{
    id: string
    currentSetId: string
    newSetId: string
    tcgcsvId: number
    name: string
  }>
}
export declare class ConcurrentPipeline<T = SetData> {
  private options
  private fetchQueue
  private processQueue
  private dbNewQueue
  private dbUpdateQueue
  private migrationQueue
  private activeFetchers
  private activeProcessors
  private activeDbWriters
  private tokens
  private lastRefill
  private readonly refillMs
  private processCallback
  private context
  private startTime
  private totalTasks
  private completedTasks
  private fetchLimiter
  private processLimiter
  private dbLimiter
  constructor(options: PipelineOptions)
  setContext(context: any): void
  onProcess(callback: (data: T) => Promise<ProcessedData>): void
  addFetchTask(task: () => Promise<T>): void
  run(): Promise<void>
  private acquireToken
  private fetchWorker
  private startProcessor
  private startDbWriter
  private commitDbBatch
  drain(): Promise<void>
}
export declare function createRateLimitedAxios(rateLimit: number): {
  get: <T>(url: string, opts?: any) => Promise<T>
}
export {}
