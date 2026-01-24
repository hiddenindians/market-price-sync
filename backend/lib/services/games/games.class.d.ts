import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Games, GamesData, GamesPatch, GamesQuery } from './games.schema';
export type { Games, GamesData, GamesPatch, GamesQuery };
export interface GamesParams extends MongoDBAdapterParams<GamesQuery> {
}
export declare class GamesService<ServiceParams extends Params = GamesParams> extends MongoDBService<Games, GamesData, GamesParams, GamesPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
