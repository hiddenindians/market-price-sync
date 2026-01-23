import type { Application } from '../../declarations'
import { GamesService } from './games.class'
import { gamesPath } from './games.shared'
export * from './games.class'
export * from './games.schema'
export declare const games: (app: Application) => void
declare module '../../declarations' {
  interface ServiceTypes {
    [gamesPath]: GamesService
  }
}
