import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { Games, GamesData, GamesPatch, GamesQuery, GamesService } from './games.class';
export type { Games, GamesData, GamesPatch, GamesQuery };
export type GamesClientService = Pick<GamesService<Params<GamesQuery>>, (typeof gamesMethods)[number]>;
export declare const gamesPath = "games";
export declare const gamesMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const gamesClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [gamesPath]: GamesClientService;
    }
}
