import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers';
import type { Application } from '../../declarations';
type FetchSets = any;
type FetchSetsData = any;
type FetchSetsPatch = any;
type FetchSetsQuery = any;
export type { FetchSets, FetchSetsData, FetchSetsPatch, FetchSetsQuery };
export interface FetchSetsServiceOptions {
    app: Application;
}
export interface FetchSetsParams extends Params<FetchSetsQuery> {
}
export declare class FetchSetsService<ServiceParams extends FetchSetsParams = FetchSetsParams> implements ServiceInterface<FetchSets, FetchSetsData, ServiceParams, FetchSetsPatch> {
    options: FetchSetsServiceOptions;
    constructor(options: FetchSetsServiceOptions);
    find(_params?: ServiceParams): Promise<FetchSets[]>;
    get(id: Id, _params?: ServiceParams): Promise<FetchSets>;
    create(data: FetchSetsData, params?: ServiceParams): Promise<FetchSets>;
    create(data: FetchSetsData[], params?: ServiceParams): Promise<FetchSets[]>;
    update(id: NullableId, data: FetchSetsData, _params?: ServiceParams): Promise<FetchSets>;
    patch(id: NullableId, data: FetchSetsPatch, _params?: ServiceParams): Promise<FetchSets>;
    remove(id: NullableId, _params?: ServiceParams): Promise<FetchSets>;
}
export declare const getOptions: (app: Application) => {
    app: Application;
};
