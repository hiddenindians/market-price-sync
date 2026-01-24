import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Settings, SettingsData, SettingsPatch, SettingsQuery } from './settings.schema';
export type { Settings, SettingsData, SettingsPatch, SettingsQuery };
export interface SettingsParams extends MongoDBAdapterParams<SettingsQuery> {
}
export declare class SettingsService<ServiceParams extends Params = SettingsParams> extends MongoDBService<Settings, SettingsData, SettingsParams, SettingsPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
