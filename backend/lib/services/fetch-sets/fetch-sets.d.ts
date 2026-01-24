import type { Application } from '../../declarations';
import { FetchSetsService } from './fetch-sets.class';
import { fetchSetsPath } from './fetch-sets.shared';
export * from './fetch-sets.class';
export declare const fetchSets: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [fetchSetsPath]: FetchSetsService;
    }
}
