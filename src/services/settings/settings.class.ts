// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Settings, SettingsData, SettingsPatch, SettingsQuery } from './settings.schema'

export type { Settings, SettingsData, SettingsPatch, SettingsQuery }

export interface SettingsParams extends MongoDBAdapterParams<SettingsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class SettingsService<ServiceParams extends Params = SettingsParams> extends MongoDBService<
  Settings,
  SettingsData,
  SettingsParams,
  SettingsPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('settings'))
  }
}
