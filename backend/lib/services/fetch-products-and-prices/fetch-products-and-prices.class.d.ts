import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers';
import type { Application } from '../../declarations';
type FetchProductsAndPrices = any;
type FetchProductsAndPricesData = any;
type FetchProductsAndPricesPatch = any;
type FetchProductsAndPricesQuery = any;
export type { FetchProductsAndPrices, FetchProductsAndPricesData, FetchProductsAndPricesPatch, FetchProductsAndPricesQuery };
export interface FetchProductsAndPricesServiceOptions {
    app: Application;
}
export interface FetchProductsAndPricesParams extends Params<FetchProductsAndPricesQuery> {
}
export declare class FetchProductsAndPricesService<ServiceParams extends FetchProductsAndPricesParams = FetchProductsAndPricesParams> implements ServiceInterface<FetchProductsAndPrices, FetchProductsAndPricesData, ServiceParams, FetchProductsAndPricesPatch> {
    options: FetchProductsAndPricesServiceOptions;
    constructor(options: FetchProductsAndPricesServiceOptions);
    find(_params?: ServiceParams): Promise<FetchProductsAndPrices[]>;
    get(id: Id, _params?: ServiceParams): Promise<FetchProductsAndPrices>;
    create(data: FetchProductsAndPricesData, params?: ServiceParams): Promise<FetchProductsAndPrices>;
    create(data: FetchProductsAndPricesData[], params?: ServiceParams): Promise<FetchProductsAndPrices[]>;
    update(id: NullableId, data: FetchProductsAndPricesData, _params?: ServiceParams): Promise<FetchProductsAndPrices>;
    patch(id: NullableId, data: FetchProductsAndPricesPatch, _params?: ServiceParams): Promise<FetchProductsAndPrices>;
    remove(id: NullableId, _params?: ServiceParams): Promise<FetchProductsAndPrices>;
}
export declare const getOptions: (app: Application) => {
    app: Application;
};
