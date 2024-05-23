// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

type FetchSets = any
type FetchSetsData = any
type FetchSetsPatch = any
type FetchSetsQuery = any

export type { FetchSets, FetchSetsData, FetchSetsPatch, FetchSetsQuery }

export interface FetchSetsServiceOptions {
  app: Application
}

export interface FetchSetsParams extends Params<FetchSetsQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class FetchSetsService<ServiceParams extends FetchSetsParams = FetchSetsParams>
  implements ServiceInterface<FetchSets, FetchSetsData, ServiceParams, FetchSetsPatch>
{
  constructor(public options: FetchSetsServiceOptions) {}

  async find(_params?: ServiceParams): Promise<FetchSets[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<FetchSets> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: FetchSetsData, params?: ServiceParams): Promise<FetchSets>
  async create(data: FetchSetsData[], params?: ServiceParams): Promise<FetchSets[]>
  async create(
    data: FetchSetsData | FetchSetsData[],
    params?: ServiceParams
  ): Promise<FetchSets | FetchSets[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: FetchSetsData, _params?: ServiceParams): Promise<FetchSets> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: FetchSetsPatch, _params?: ServiceParams): Promise<FetchSets> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<FetchSets> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
