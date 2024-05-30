// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  FetchProductsAndPrices,
  FetchProductsAndPricesData,
  FetchProductsAndPricesPatch,
  FetchProductsAndPricesQuery,
  FetchProductsAndPricesService
} from './fetch-products-and-prices.class'

export type {
  FetchProductsAndPrices,
  FetchProductsAndPricesData,
  FetchProductsAndPricesPatch,
  FetchProductsAndPricesQuery
}

export type FetchProductsAndPricesClientService = Pick<
  FetchProductsAndPricesService<Params<FetchProductsAndPricesQuery>>,
  (typeof fetchProductsAndPricesMethods)[number]
>

export const fetchProductsAndPricesPath = 'fetch-products-and-prices'

export const fetchProductsAndPricesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const fetchProductsAndPricesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(fetchProductsAndPricesPath, connection.service(fetchProductsAndPricesPath), {
    methods: fetchProductsAndPricesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [fetchProductsAndPricesPath]: FetchProductsAndPricesClientService
  }
}
