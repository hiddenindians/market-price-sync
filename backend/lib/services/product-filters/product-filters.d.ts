import type { Application } from '../../declarations'
import { ProductFiltersService } from './product-filters.class'
import { productFiltersPath } from './product-filters.shared'
export * from './product-filters.class'
export declare const productFilters: (app: Application) => void
declare module '../../declarations' {
  interface ServiceTypes {
    [productFiltersPath]: ProductFiltersService
  }
}
