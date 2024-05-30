// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Prices, PricesData, PricesPatch, PricesQuery, PricesService } from './prices.class'

export type { Prices, PricesData, PricesPatch, PricesQuery }

export type PricesClientService = Pick<PricesService<Params<PricesQuery>>, (typeof pricesMethods)[number]>

export const pricesPath = 'prices'

export const pricesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const pricesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(pricesPath, connection.service(pricesPath), {
    methods: pricesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [pricesPath]: PricesClientService
  }
}
