import type { Params, ServiceInterface } from '@feathersjs/feathers';
import type { Application } from '../../declarations';
export interface ProductFiltersQuery {
    gameId?: string;
    setId?: string;
}
export interface ProductFiltersResult {
    rarities: string[];
    finishes: {
        key: string;
        label: string;
    }[];
    prints: {
        key: string;
        label: string;
    }[];
    events: {
        key: string;
        label: string;
    }[];
}
export interface ProductFiltersServiceOptions {
    app: Application;
}
export interface ProductFiltersParams extends Params<ProductFiltersQuery> {
}
export declare class ProductFiltersService<ServiceParams extends ProductFiltersParams = ProductFiltersParams> implements ServiceInterface<ProductFiltersResult, never, ServiceParams, never> {
    private readonly options;
    constructor(options: ProductFiltersServiceOptions);
    find(params?: ServiceParams): Promise<ProductFiltersResult>;
}
export declare const getOptions: (app: Application) => ProductFiltersServiceOptions;
