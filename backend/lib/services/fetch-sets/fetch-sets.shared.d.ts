import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { FetchSets, FetchSetsData, FetchSetsPatch, FetchSetsQuery, FetchSetsService } from './fetch-sets.class';
export type { FetchSets, FetchSetsData, FetchSetsPatch, FetchSetsQuery };
export type FetchSetsClientService = Pick<FetchSetsService<Params<FetchSetsQuery>>, (typeof fetchSetsMethods)[number]>;
export declare const fetchSetsPath = "fetch-sets";
export declare const fetchSetsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const fetchSetsClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [fetchSetsPath]: FetchSetsClientService;
    }
}
