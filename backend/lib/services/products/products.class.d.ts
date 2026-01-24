import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { Products, ProductsData, ProductsPatch, ProductsQuery } from './products.schema';
export type { Products, ProductsData, ProductsPatch, ProductsQuery };
export interface ProductsParams extends MongoDBAdapterParams<ProductsQuery> {
}
export declare class ProductsService<ServiceParams extends Params = ProductsParams> extends MongoDBService<Products, ProductsData, ProductsParams, ProductsPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
