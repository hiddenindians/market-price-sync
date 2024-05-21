// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Products, ProductsData, ProductsPatch, ProductsQuery } from './products.schema'

export type { Products, ProductsData, ProductsPatch, ProductsQuery }

export interface ProductsParams extends MongoDBAdapterParams<ProductsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ProductsService<ServiceParams extends Params = ProductsParams> extends MongoDBService<
  Products,
  ProductsData,
  ProductsParams,
  ProductsPatch
> {

  }

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: {
      default: 10,
      max: 500000
    },
    Model: app.get('mongodbClient').then((db) => db.collection('products')).then((collection) => {
      collection.createIndex({name: 1, 'external_id.tcgcsv_id': 1}, {unique: true})
      return collection
    })
  }
}
