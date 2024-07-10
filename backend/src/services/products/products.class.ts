// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Products, ProductsData, ProductsPatch, ProductsQuery } from './products.schema'
import { app } from '../../app'

export type { Products, ProductsData, ProductsPatch, ProductsQuery }

export interface ProductsParams extends MongoDBAdapterParams<ProductsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ProductsService<ServiceParams extends Params = ProductsParams> extends MongoDBService<
  Products,
  ProductsData,
  ProductsParams,
  ProductsPatch
> {
  async find(params?: ProductsParams): Promise<any> {
    const { query } = params || {};
    const { $sort, ...restQuery } = query || {};

    if ($sort && Object.keys($sort).some(key => key.startsWith('price.market_price'))) {
      const sortKey = Object.keys($sort).find(key => key.startsWith('price.market_price'))!;
      const sortDirection = ($sort as { [key: string]: number })[sortKey] === 1 ? 1 : -1;
      console.log(sortKey)
      // Fetch products without sorting
      const products = await app.service('products').find({query: restQuery})
      const total = products.total
      const productArray = products.data

      // Custom sorting logic
      productArray.sort((a: any, b: any) => {
        const aValue = Math.min(...Object.values(a.price.market_price || {}).map(Number));
        const bValue = Math.min(...Object.values(b.price.market_price || {}).map(Number));
        return (aValue - bValue) * sortDirection;
      });

      return {
        total: products.total,
        limit: params?.query?.$limit || productArray.length,
        skip: params?.query?.$skip || 0,
        data: productArray.slice(params?.query?.$skip || 0, (params?.query?.$skip || 0) + (params?.query?.$limit || productArray.length))
      };
    }

    return super.find(params);
  }

  }

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: {
      default: 10,
      max: 500000
    },
    Model: app.get('mongodbClient').then((db) => db.collection('products')).then((collection) => {
      collection.createIndex({name: 1, 'external_id.tcgcsv_id': 1}, {unique: true})
      collection.createIndex({collector_number: 1})
      collection.createIndex({sort_number: 1})
      

      return collection
    })
  }
}
