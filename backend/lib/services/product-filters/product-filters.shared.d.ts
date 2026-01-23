import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { ProductFiltersResult, ProductFiltersService } from './product-filters.class'
export type { ProductFiltersResult }
export type ProductFiltersClientService = Pick<
  ProductFiltersService<Params>,
  (typeof productFiltersMethods)[number]
>
export declare const productFiltersPath = 'products/filters'
export declare const productFiltersMethods: readonly ['find']
export declare const productFiltersClient: (client: ClientApplication) => void
declare module '../../client' {
  interface ServiceTypes {
    [productFiltersPath]: ProductFiltersClientService
  }
}
