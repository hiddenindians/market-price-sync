// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Sets, SetsData, SetsPatch, SetsQuery } from './sets.schema'
import { Collection } from 'mongodb'

export type { Sets, SetsData, SetsPatch, SetsQuery }

export interface SetsParams extends MongoDBAdapterParams<SetsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class SetsService<ServiceParams extends Params = SetsParams> extends MongoDBService<
  Sets,
  SetsData,
  SetsParams,
  SetsPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: {
      default: 10,
      max: 500000
    },
    Model: app.get('mongodbClient').then((db) => db.collection('sets')).then( (collection) => {
      collection.createIndex({'external_id.tcgcsv_id': 1}, {unique: true})
      return collection
    })
  }
}
