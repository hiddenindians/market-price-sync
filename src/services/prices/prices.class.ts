// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Prices, PricesData, PricesPatch, PricesQuery } from './prices.schema'

export type { Prices, PricesData, PricesPatch, PricesQuery }

export interface PricesParams extends MongoDBAdapterParams<PricesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class PricesService<ServiceParams extends Params = PricesParams> extends MongoDBService<
  Prices,
  PricesData,
  PricesParams,
  PricesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('prices')).then((collection) => {
      collection.createIndex({ product_id: 1})
      return collection
    })
  }
}
