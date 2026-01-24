import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Sets, SetsData, SetsPatch, SetsQuery } from './sets.schema';
export type { Sets, SetsData, SetsPatch, SetsQuery };
export interface SetsParams extends MongoDBAdapterParams<SetsQuery> {
}
export declare class SetsService<ServiceParams extends Params = SetsParams> extends MongoDBService<Sets, SetsData, SetsParams, SetsPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
