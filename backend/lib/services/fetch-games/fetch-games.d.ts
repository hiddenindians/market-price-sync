import type { Application } from '../../declarations'
import { FetchGamesService } from './fetch-games.class'
import { fetchGamesPath } from './fetch-games.shared'
export * from './fetch-games.class'
export declare const fetchGames: (app: Application) => void
declare module '../../declarations' {
  interface ServiceTypes {
    [fetchGamesPath]: FetchGamesService
  }
}
