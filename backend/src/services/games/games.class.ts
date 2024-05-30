// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Games, GamesData, GamesPatch, GamesQuery } from './games.schema'

export type { Games, GamesData, GamesPatch, GamesQuery }

export interface GamesParams extends MongoDBAdapterParams<GamesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class GamesService<ServiceParams extends Params = GamesParams> extends MongoDBService<
  Games,
  GamesData,
  GamesParams,
  GamesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: {
      default: 10,
      max: 500000
    },
    Model: app.get('mongodbClient').then((db) => db.collection('games'))
  }
}
