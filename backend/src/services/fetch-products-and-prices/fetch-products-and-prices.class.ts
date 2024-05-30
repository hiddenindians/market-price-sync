// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

type FetchProductsAndPrices = any
type FetchProductsAndPricesData = any
type FetchProductsAndPricesPatch = any
type FetchProductsAndPricesQuery = any

export type {
  FetchProductsAndPrices,
  FetchProductsAndPricesData,
  FetchProductsAndPricesPatch,
  FetchProductsAndPricesQuery
}

export interface FetchProductsAndPricesServiceOptions {
  app: Application
}

export interface FetchProductsAndPricesParams extends Params<FetchProductsAndPricesQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class FetchProductsAndPricesService<
  ServiceParams extends FetchProductsAndPricesParams = FetchProductsAndPricesParams
> implements
    ServiceInterface<
      FetchProductsAndPrices,
      FetchProductsAndPricesData,
      ServiceParams,
      FetchProductsAndPricesPatch
    >
{
  constructor(public options: FetchProductsAndPricesServiceOptions) {}

  async find(_params?: ServiceParams): Promise<FetchProductsAndPrices[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<FetchProductsAndPrices> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: FetchProductsAndPricesData, params?: ServiceParams): Promise<FetchProductsAndPrices>
  async create(data: FetchProductsAndPricesData[], params?: ServiceParams): Promise<FetchProductsAndPrices[]>
  async create(
    data: FetchProductsAndPricesData | FetchProductsAndPricesData[],
    params?: ServiceParams
  ): Promise<FetchProductsAndPrices | FetchProductsAndPrices[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(
    id: NullableId,
    data: FetchProductsAndPricesData,
    _params?: ServiceParams
  ): Promise<FetchProductsAndPrices> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(
    id: NullableId,
    data: FetchProductsAndPricesPatch,
    _params?: ServiceParams
  ): Promise<FetchProductsAndPrices> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<FetchProductsAndPrices> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
