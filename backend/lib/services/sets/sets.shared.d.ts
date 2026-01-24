import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { Sets, SetsData, SetsPatch, SetsQuery, SetsService } from './sets.class';
export type { Sets, SetsData, SetsPatch, SetsQuery };
export type SetsClientService = Pick<SetsService<Params<SetsQuery>>, (typeof setsMethods)[number]>;
export declare const setsPath = "sets";
export declare const setsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const setsClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [setsPath]: SetsClientService;
    }
}
