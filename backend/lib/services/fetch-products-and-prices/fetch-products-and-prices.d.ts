import type { Application } from '../../declarations';
import { FetchProductsAndPricesService } from './fetch-products-and-prices.class';
import { fetchProductsAndPricesPath } from './fetch-products-and-prices.shared';
export * from './fetch-products-and-prices.class';
export declare const fetchProductsAndPrices: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [fetchProductsAndPricesPath]: FetchProductsAndPricesService;
    }
}
