import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { ProductFiltersResult, ProductFiltersService } from './product-filters.class'

export type { ProductFiltersResult }

export type ProductFiltersClientService = Pick<
  ProductFiltersService<Params>,
  (typeof productFiltersMethods)[number]
>

export const productFiltersPath = 'products/filters'

export const productFiltersMethods = ['find'] as const

export const productFiltersClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(productFiltersPath, connection.service(productFiltersPath), {
    methods: productFiltersMethods
  })
}

declare module '../../client' {
  interface ServiceTypes {
    [productFiltersPath]: ProductFiltersClientService
  }
}
