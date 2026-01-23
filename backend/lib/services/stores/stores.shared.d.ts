import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Stores, StoresData, StoresPatch, StoresQuery, StoresService } from './stores.class'
export type { Stores, StoresData, StoresPatch, StoresQuery }
export type StoresClientService = Pick<StoresService<Params<StoresQuery>>, (typeof storesMethods)[number]>
export declare const storesPath = 'stores'
export declare const storesMethods: readonly ['find', 'get', 'create', 'patch', 'remove']
export declare const storesClient: (client: ClientApplication) => void
declare module '../../client' {
  interface ServiceTypes {
    [storesPath]: StoresClientService
  }
}
