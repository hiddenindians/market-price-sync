// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Stores, StoresData, StoresPatch, StoresQuery } from './stores.schema'

export type { Stores, StoresData, StoresPatch, StoresQuery }

export interface StoresParams extends MongoDBAdapterParams<StoresQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class StoresService<ServiceParams extends Params = StoresParams> extends MongoDBService<
  Stores,
  StoresData,
  StoresParams,
  StoresPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('stores'))
  }
}
