import type { Application } from '../../declarations';
import { StoresService } from './stores.class';
import { storesPath } from './stores.shared';
export * from './stores.class';
export * from './stores.schema';
export declare const stores: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [storesPath]: StoresService;
    }
}
