import type { Application } from '../../declarations'
import { SetsService } from './sets.class'
import { setsPath } from './sets.shared'
export * from './sets.class'
export * from './sets.schema'
export declare const sets: (app: Application) => void
declare module '../../declarations' {
  interface ServiceTypes {
    [setsPath]: SetsService
  }
}
