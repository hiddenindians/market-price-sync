import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Prices, PricesData, PricesPatch, PricesQuery } from './prices.schema';
export type { Prices, PricesData, PricesPatch, PricesQuery };
export interface PricesParams extends MongoDBAdapterParams<PricesQuery> {
}
export declare class PricesService<ServiceParams extends Params = PricesParams> extends MongoDBService<Prices, PricesData, PricesParams, PricesPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
