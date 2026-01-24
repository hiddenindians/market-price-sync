import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { Products, ProductsData, ProductsPatch, ProductsQuery, ProductsService } from './products.class';
export type { Products, ProductsData, ProductsPatch, ProductsQuery };
export type ProductsClientService = Pick<ProductsService<Params<ProductsQuery>>, (typeof productsMethods)[number]>;
export declare const productsPath = "products";
export declare const productsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const productsClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [productsPath]: ProductsClientService;
    }
}
