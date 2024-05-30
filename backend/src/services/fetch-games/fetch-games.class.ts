// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
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

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class FetchGamesService<ServiceParams extends FetchGamesParams = FetchGamesParams>
  implements ServiceInterface<FetchGames, FetchGamesData, ServiceParams, FetchGamesPatch>
{
  constructor(public options: FetchGamesServiceOptions) {}

  async find(_params?: ServiceParams): Promise<FetchGames[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<FetchGames> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: FetchGamesData, params?: ServiceParams): Promise<FetchGames>
  async create(data: FetchGamesData[], params?: ServiceParams): Promise<FetchGames[]>
  async create(
    data: FetchGamesData | FetchGamesData[],
    params?: ServiceParams
  ): Promise<FetchGames | FetchGames[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: FetchGamesData, _params?: ServiceParams): Promise<FetchGames> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: FetchGamesPatch, _params?: ServiceParams): Promise<FetchGames> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<FetchGames> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
