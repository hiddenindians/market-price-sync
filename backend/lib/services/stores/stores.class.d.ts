import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Stores, StoresData, StoresPatch, StoresQuery } from './stores.schema';
export type { Stores, StoresData, StoresPatch, StoresQuery };
export interface StoresParams extends MongoDBAdapterParams<StoresQuery> {
}
export declare class StoresService<ServiceParams extends Params = StoresParams> extends MongoDBService<Stores, StoresData, StoresParams, StoresPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
