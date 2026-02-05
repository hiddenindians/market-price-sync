import { Injectable } from '@angular/core'
import { FeathersService } from '../api/feathers.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private _feathers: FeathersService) {}

  public getGames(limit: number, skip: number, sort: { active: string; direction: string } | null): any {
    let direction = -1
    if (sort != null) {
      if (sort.direction === 'ASC') {
        direction = 1
      }
      return this._feathers.service('games').find({
        query: {
          $limit: limit,
          $skip: skip,
          $sort: {
            [sort.active]: direction
          }
        }
      })
    }
  }

  getSetsForGame(gameId: string) {
    return this._feathers.service('sets').find({
      query: {
        game_id: gameId,
        $limit: 10000,
        $sort: {
          'external_id.tcgcsv_id': -1
        }
      }
    })
  }

  async getProduct(query: {}) {
    // console.log(query)
    return await this._feathers.service('products').find({ query: query })
  }

  getProductByPOSId(posId: string, storeId: string, condition: string) {
    return this._feathers.service('products').find({
      query: {
        [`store_status.${storeId}.${condition}.pos_id`]: posId
      }
    })
  }

  getProductsForGame(
    gameId: string,
    limit: number,
    skip: number,
    sort: { active: string; direction: string } | null,
    filters: ProductsFilterQuery = {}
  ) {
    let direction = -1
    if (sort != null) {
      if (sort.direction === 'ASC') {
        direction = 1
      }
      const sortField = sort.active === 'collector_number' ? 'sort_number' : sort.active
      return this._feathers.service('products').find({
        query: {
          game_id: gameId,
          $sort: {
            [sortField]: direction
          },
          $limit: limit,
          $skip: skip,
          ...(filters.rarities?.length ? { rarities: filters.rarities } : {}),
          ...(filters.prints?.length ? { prints: filters.prints } : {}),
          ...(filters.finishes?.length ? { finishes: filters.finishes } : {}),
          ...(filters.events?.length ? { events: filters.events } : {}),
          ...(filters.onlyEvents ? { onlyEvents: true } : {}),
          ...(filters.excludeEvents ? { excludeEvents: true } : {}),
          ...(filters.onlyPromo ? { onlyPromo: true } : {}),
          ...(filters.excludePromo ? { excludePromo: true } : {}),
          ...(filters.minPrice != null ? { minPrice: filters.minPrice } : {}),
          ...(filters.maxPrice != null ? { maxPrice: filters.maxPrice } : {})
        }
      })
    }
  }

  getProductsForSet(
    setId: string,
    limit: number,
    skip: number,
    sort: { active: string; direction: string } | null,
    filters: ProductsFilterQuery = {}
  ) {
    let direction = -1
    if (sort != null) {
      if (sort.direction === 'ASC') {
        direction = 1
      }

      const sortField = sort.active === 'collector_number' ? 'sort_number' : sort.active

      return this._feathers.service('products').find({
        query: {
          set_id: setId,
          $sort: { 
            [sortField]: direction 
          },
          $limit: limit,
          $skip: skip,
          ...(filters.rarities?.length ? { rarities: filters.rarities } : {}),
          ...(filters.prints?.length ? { prints: filters.prints } : {}),
          ...(filters.finishes?.length ? { finishes: filters.finishes } : {}),
          ...(filters.events?.length ? { events: filters.events } : {}),
          ...(filters.onlyEvents ? { onlyEvents: true } : {}),
          ...(filters.excludeEvents ? { excludeEvents: true } : {}),
          ...(filters.onlyPromo ? { onlyPromo: true } : {}),
          ...(filters.excludePromo ? { excludePromo: true } : {}),
          ...(filters.minPrice != null ? { minPrice: filters.minPrice } : {}),
          ...(filters.maxPrice != null ? { maxPrice: filters.maxPrice } : {})
        }
      })
    }
  }

  getProductByEComIDs(storeId: string, condition: string, id: string, variantId: string) {
    return this._feathers.service('products').find({
      query: {
        [`store_status.${storeId}.${condition}.ecom_pid`]: id,
        [`store_status.${storeId}.${condition}.ecom_vid`]: variantId
      }
    })
  }

  getSelling(storeId: string) {
    let query: Query = {
      $or: [
        { [`store_status.${storeId}.near_mint.selling.enabled`]: true },
        { [`store_status.${storeId}.lightly_played.selling.enabled`]: true },
        { [`store_status.${storeId}.moderately_played.selling.enabled`]: true },
        { [`store_status.${storeId}.heavily_played.selling.enabled`]: true },
        { [`store_status.${storeId}.damaged.selling.enabled`]: true }
      ],
      $limit: 20000,
      $sort: {
        sort_number: 1,
        'external_id.tcgcsv_group_id': 1
      }
    }

    return this._feathers.service('products').find({ query: query })
  }

  getSellingWithPosId(storeId: string) {
    let query: Query = {
      $or: [
        {
          [`store_status.${storeId}.near_mint.selling.enabled`]: true,
          [`store_status.${storeId}.near_mint.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.lightly_played.selling.enabled`]: true,
          [`store_status.${storeId}.lightly_played.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.moderately_played.selling.enabled`]: true,
          [`store_status.${storeId}.moderately_played.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.heavily_played.selling.enabled`]: true,
          [`store_status.${storeId}.heavily_played.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.damaged.selling.enabled`]: true,
          [`store_status.${storeId}.damaged.pos_id`]: { $exists: true, $ne: '' }
        }
      ],
      $limit: 20000,
      $sort: {
        sort_number: 1,
        'external_id.tcgcsv_group_id': 1
      }
    }

    return this._feathers.service('products').find({ query: query })
  }
  getSellingForSet(setId: string, storeId: string, newProductsOnly: boolean) {
    let query: Query = {
      set_id: setId,
      $or: [
        { [`store_status.${storeId}.near_mint.selling.enabled`]: true },
        { [`store_status.${storeId}.lightly_played.selling.enabled`]: true },
        { [`store_status.${storeId}.moderately_played.selling.enabled`]: true },
        { [`store_status.${storeId}.heavily_played.selling.enabled`]: true },
        { [`store_status.${storeId}.damaged.selling.enabled`]: true }
      ],
      $limit: 10000,
      $sort: {
        sort_number: 1,
        'external_id.tcgcsv_group_id': 1
      }
    }

    if (newProductsOnly) {
      query['$and'] = [
        {
          $or: [
            {
              [`store_status.${storeId}.near_mint.selling.enabled`]: true,
              [`store_status.${storeId}.near_mint.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.lightly_played.selling.enabled`]: true,
              [`store_status.${storeId}.lightly_played.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.moderately_played.selling.enabled`]: true,
              [`store_status.${storeId}.moderately_played.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.heavily_played.selling.enabled`]: true,
              [`store_status.${storeId}.heavily_played.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.damaged.selling.enabled`]: true,
              [`store_status.${storeId}.damaged.pos_id`]: { $exists: false }
            }
          ]
        }
      ]
    }
    return this._feathers.service('products').find({
      query: query
    })
  }

  getSellingForGame(gameId: string, storeId: string, newProductsOnly: boolean) {
    let query: Query = {
      game_id: gameId,
      $or: [
        { [`store_status.${storeId}.near_mint.selling.enabled`]: true },
        { [`store_status.${storeId}.lightly_played.selling.enabled`]: true },
        { [`store_status.${storeId}.moderately_played.selling.enabled`]: true },
        { [`store_status.${storeId}.heavily_played.selling.enabled`]: true },
        { [`store_status.${storeId}.damaged.selling.enabled`]: true }
      ],
      $limit: 10000,
      $sort: {
        sort_number: 1,
        'external_id.tcgcsv_group_id': 1
      }
    }
    if (newProductsOnly) {
      query['$and'] = [
        {
          $or: [
            {
              [`store_status.${storeId}.near_mint.selling.enabled`]: true,
              [`store_status.${storeId}.near_mint.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.lightly_played.selling.enabled`]: true,
              [`store_status.${storeId}.lightly_played.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.moderately_played.selling.enabled`]: true,
              [`store_status.${storeId}.moderately_played.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.heavily_played.selling.enabled`]: true,
              [`store_status.${storeId}.heavily_played.pos_id`]: { $exists: false }
            },
            {
              [`store_status.${storeId}.damaged.selling.enabled`]: true,
              [`store_status.${storeId}.damaged.pos_id`]: { $exists: false }
            }
          ]
        }
      ]
    }
    return this._feathers.service('products').find({
      query: query
    })
  }

  getSellingForGameWithPosId(gameId: string, storeId: string) {
    let query: Query = {
      game_id: gameId,
      $or: [
        {
          [`store_status.${storeId}.near_mint.selling.enabled`]: true,
          [`store_status.${storeId}.near_mint.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.lightly_played.selling.enabled`]: true,
          [`store_status.${storeId}.lightly_played.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.moderately_played.selling.enabled`]: true,
          [`store_status.${storeId}.moderately_played.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.heavily_played.selling.enabled`]: true,
          [`store_status.${storeId}.heavily_played.pos_id`]: { $exists: true, $ne: '' }
        },
        {
          [`store_status.${storeId}.damaged.selling.enabled`]: true,
          [`store_status.${storeId}.damaged.pos_id`]: { $exists: true, $ne: '' }
        }
      ],
      $limit: 10000,
      $sort: {
        sort_number: 1,
        'external_id.tcgcsv_group_id': 1
      }
    }

    return this._feathers.service('products').find({
      query: query
    })
  }

  async search(
    term: string,
    sort: { active: string; direction: string } | null,
    filters: ProductsFilterQuery = {},
    pagination: { limit?: number; skip?: number } = {}
  ) {
    const query: Record<string, unknown> = {
      $text: { $search: `"${term}"` }
    }

    if (sort) {
      const direction = sort.direction === 'ASC' ? 1 : -1
      const sortField = sort.active === 'collector_number' ? 'sort_number' : sort.active
      query['$sort'] = { [sortField]: direction }
    }

    if (pagination.limit !== undefined) {
      query['$limit'] = pagination.limit
    }

    if (pagination.skip !== undefined) {
      query['$skip'] = pagination.skip
    }

    if (filters.rarities?.length) {
      query['rarities'] = filters.rarities
    }

    if (filters.prints?.length) {
      query['prints'] = filters.prints
    }

    if (filters.finishes?.length) {
      query['finishes'] = filters.finishes
    }

    if (filters.events?.length) {
      query['events'] = filters.events
    }

    if (filters.onlyEvents) {
      query['onlyEvents'] = true
    }

    if (filters.excludeEvents) {
      query['excludeEvents'] = true
    }

    if (filters.onlyPromo) {
      query['onlyPromo'] = true
    }

    if (filters.excludePromo) {
      query['excludePromo'] = true
    }

    if (filters.minPrice != null) {
      query['minPrice'] = filters.minPrice
    }

    if (filters.maxPrice != null) {
      query['maxPrice'] = filters.maxPrice
    }

    return this._feathers.service('products').find({
      query
    })
  }

  async getGameNameFromId(gameId: string): Promise<string> {
    let toReturn = ''
    await this._feathers
      .service('games')
      .find({
        query: {
          _id: gameId
        }
      })
      .then((data: any) => {
        toReturn = data.data[0].name
      })

    return toReturn
  }
  async getSetNameFromId(setId: string): Promise<string> {
    let toReturn = ''
    await this._feathers
      .service('sets')
      .find({
        query: {
          _id: setId
        }
      })
      .then((data: any) => {
        toReturn = data.data[0].name
      })

    return toReturn
  }

  async patchProduct(id: string, body: {}) {
    await this._feathers.service('products').patch(id, body)
  }

  getProductFilters(gameId: string, setId?: string) {
    const query: { gameId: string; setId?: string } = { gameId }
    if (setId) {
      query.setId = setId
    }
    return this._feathers.service('products/filters').find({
      query
    })
  }
  updateSellingStatus(id: string, storeId: string, enabled: boolean, condition: string) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.${condition}.selling.enabled`]: enabled
    })
  }

  updateBuyingStatus(id: string, storeId: string, enabled: boolean, condition: string) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.${condition}.buying.enabled`]: enabled
    })
  }

  updatSellingQuantity(id: string, storeId: string, quantity: number, condition: string) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.${condition}.selling.quantity`]: quantity
    })
  }

  updateBuyingQuantity(id: string, storeId: string, quantity: number, condition: string) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.${condition}.buying.quantity`]: quantity
    })
  }

  createOrder(order: any) {}
}

interface Query {
  [key: string]: any // Allow any additional MongoDB properties
  set_id?: string
  game_id?: string
  $limit: number
  $sort?: {
    sort_number: number
    'external_id.tcgcsv_group_id': number
  }
}

interface ProductsFilterQuery {
  rarities?: string[]
  prints?: string[]
  finishes?: string[]
  events?: string[]
  onlyEvents?: boolean
  excludeEvents?: boolean
  onlyPromo?: boolean
  excludePromo?: boolean
  minPrice?: number | null
  maxPrice?: number | null
}
