import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  FetchGames,
  FetchGamesData,
  FetchGamesPatch,
  FetchGamesQuery,
  FetchGamesService
} from './fetch-games.class'
export type { FetchGames, FetchGamesData, FetchGamesPatch, FetchGamesQuery }
export type FetchGamesClientService = Pick<
  FetchGamesService<Params<FetchGamesQuery>>,
  (typeof fetchGamesMethods)[number]
>
export declare const fetchGamesPath = 'fetch-games'
export declare const fetchGamesMethods: readonly ['find', 'get', 'create', 'patch', 'remove']
export declare const fetchGamesClient: (client: ClientApplication) => void
declare module '../../client' {
  interface ServiceTypes {
    [fetchGamesPath]: FetchGamesClientService
  }
}
