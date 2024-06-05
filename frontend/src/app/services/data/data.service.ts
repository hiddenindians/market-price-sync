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
      return this._feathers
        .service('games')
        .find({
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
    return this._feathers
      .service('sets')
      .find({
        query: {
          game_id: gameId,
          $limit: 10000,
        }
      })
  }

  getProductsForGame(gameId: string, limit: number, skip: number, sort: {active: string, direction: string} | null) {
    let direction = -1
    if (sort != null) {
      if (sort.direction === 'ASC') {
        direction = 1
      }
    return this._feathers
      .service('products')
      .find({
        query: {
          game_id: gameId,
          $limit: limit, 
          $skip: skip,
          $sort: {
            [sort.active]: direction
          }
        }
      })
    }
  }

  getProductsForSet(setId: string, limit: number, skip: number, sort: {active: string, direction: string} | null) {
    let direction = -1
    if (sort != null) {
      if (sort.direction === 'ASC') {
        direction = 1
      }
    return this._feathers
      .service('products')
      .find({
        query: {
          set_id: setId,
          $limit: limit, 
          $skip: skip,
          $sort: {
            [sort.active]: direction
          }
        }
      })
    }
  }

  updateSellingStatus(id: string, storeId: string, enabled: boolean) {
    this._feathers.service('products').patch(id, {
      [`store_status.${storeId}.selling.enabled`]: enabled
    })
  }
}
