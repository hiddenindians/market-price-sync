import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Prices, PricesData, PricesPatch, PricesQuery, PricesService } from './prices.class'
export type { Prices, PricesData, PricesPatch, PricesQuery }
export type PricesClientService = Pick<PricesService<Params<PricesQuery>>, (typeof pricesMethods)[number]>
export declare const pricesPath = 'prices'
export declare const pricesMethods: readonly ['find', 'get', 'create', 'patch', 'remove']
export declare const pricesClient: (client: ClientApplication) => void
declare module '../../client' {
  interface ServiceTypes {
    [pricesPath]: PricesClientService
  }
}
