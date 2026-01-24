import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { FetchProductsAndPrices, FetchProductsAndPricesData, FetchProductsAndPricesPatch, FetchProductsAndPricesQuery, FetchProductsAndPricesService } from './fetch-products-and-prices.class';
export type { FetchProductsAndPrices, FetchProductsAndPricesData, FetchProductsAndPricesPatch, FetchProductsAndPricesQuery };
export type FetchProductsAndPricesClientService = Pick<FetchProductsAndPricesService<Params<FetchProductsAndPricesQuery>>, (typeof fetchProductsAndPricesMethods)[number]>;
export declare const fetchProductsAndPricesPath = "fetch-products-and-prices";
export declare const fetchProductsAndPricesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const fetchProductsAndPricesClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [fetchProductsAndPricesPath]: FetchProductsAndPricesClientService;
    }
}
