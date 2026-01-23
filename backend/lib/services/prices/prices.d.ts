import type { Application } from '../../declarations'
import { PricesService } from './prices.class'
import { pricesPath } from './prices.shared'
export * from './prices.class'
export * from './prices.schema'
export declare const prices: (app: Application) => void
declare module '../../declarations' {
  interface ServiceTypes {
    [pricesPath]: PricesService
  }
}
