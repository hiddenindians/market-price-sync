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

  getProduct(query: {}) {
    console.log(query)
    return this._feathers.service('products').find({ query: query })
  }

  getProductByPOSId(posId: string, storeId: string) {
    return this._feathers.service('products').find({
      query: {
        [`store_status.${storeId}.pos_id`]: posId
      }
    })
  }

  getProductsForGame(
    gameId: string,
    limit: number,
    skip: number,
    sort: { active: string; direction: string } | null
  ) {
    let direction = -1
    if (sort != null) {
      if (sort.direction === 'ASC') {
        direction = 1
      }
      return this._feathers.service('products').find({
        query: {
          game_id: gameId,
          $sort: {
            [sort.active]: direction
          },
          $limit: limit,
          $skip: skip,
          
        }
      })
    }
  }

  getProductsForSet(
    setId: string,
    limit: number,
    skip: number,
    sort: { active: string; direction: string } | null
  ) {
    let direction = -1
    if (sort != null) {
      if (sort.direction === 'ASC') {
        direction = 1
      }

     

      if (sort.active === 'collector_number'){
        sort.active = 'sort_number'
      }

      let sortBody = {
        [sort.active]: direction
      }

      if (sort.active === 'market_price'){

        sortBody = {
          'price.market_price.Normal': direction,
          'price.market_price.Foil': direction,
        }
      }

      return this._feathers.service('products').find({
        query: {
          set_id: setId,
          $sort: sortBody,
          $limit: limit,
          $skip: skip,
          
        }
      })
    }
  }

  getSellingForSet(setId: string, storeId: string, newProductsOnly: boolean) {
    let query: Query = {
      set_id: setId,
      [`store_status.${storeId}.selling.enabled`]: true,
      $limit: 10000,
      $sort: {
        sort_number: 1,
        'external_id.tcgcsv_group_id': 1
      }
    }

    if (newProductsOnly) {
      query[`store_status.${storeId}.pos_id`] = {$exists: false};  
    }
    console.log(query)
    return this._feathers.service('products').find({
      query: query
    })
  }

  getSellingForGame(gameId: string, storeId: string, newProductsOnly: boolean) {
   let query: Query = {
    game_id: gameId,
    [`store_status.${storeId}.selling.enabled`]: true,
    $limit: 10000,
    $sort: {
      sort_number: 1,
      'external_id.tcgcsv_group_id': 1
    }
  }
  if (newProductsOnly) {
    query[`store_status.${storeId}.pos_id`] = {$exists: false};  
  }
    return this._feathers.service('products').find({
      query: query
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

  patchProduct(id: string, body: {}) {
    //console.log(body)
    this._feathers.service('products').patch(id, body)
  }
  updateSellingStatus(id: string, storeId: string, enabled: boolean) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.selling.enabled`]: enabled
    })
  }

  updateBuyingStatus(id: string, storeId: string, enabled: boolean) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.buying.enabled`]: enabled
    })
  }

  updatSellingQuantity(id: string, storeId: string, quantity: number) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.selling.quantity`]: quantity
    })
  }

  updateBuyingQuantity(id: string, storeId: string, quantity: number) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.buying.quantity`]: quantity
    })
  }
}


interface Query {
  [key: string]: any; // Allow any additional MongoDB properties
  set_id?: string;
  game_id?: string;
  $limit: number;
  $sort: {
    sort_number: number;
    'external_id.tcgcsv_group_id': number;
  };
}