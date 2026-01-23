import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
type FetchGames = any
type FetchGamesData = any
type FetchGamesPatch = any
type FetchGamesQuery = any
export type { FetchGames, FetchGamesData, FetchGamesPatch, FetchGamesQuery }
export interface FetchGamesServiceOptions {
  app: Application
}
export interface FetchGamesParams extends Params<FetchGamesQuery> {}
export declare class FetchGamesService<
  ServiceParams extends FetchGamesParams = FetchGamesParams
> implements ServiceInterface<FetchGames, FetchGamesData, ServiceParams, FetchGamesPatch> {
  options: FetchGamesServiceOptions
  constructor(options: FetchGamesServiceOptions)
  find(_params?: ServiceParams): Promise<FetchGames[]>
  get(id: Id, _params?: ServiceParams): Promise<FetchGames>
  create(data: FetchGamesData, params?: ServiceParams): Promise<FetchGames>
  create(data: FetchGamesData[], params?: ServiceParams): Promise<FetchGames[]>
  update(id: NullableId, data: FetchGamesData, _params?: ServiceParams): Promise<FetchGames>
  patch(id: NullableId, data: FetchGamesPatch, _params?: ServiceParams): Promise<FetchGames>
  remove(id: NullableId, _params?: ServiceParams): Promise<FetchGames>
}
export declare const getOptions: (app: Application) => {
  app: Application
}
