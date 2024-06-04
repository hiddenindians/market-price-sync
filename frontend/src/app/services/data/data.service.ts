import { Injectable } from '@angular/core';
import { FeathersService } from '../api/feathers.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private _feathers: FeathersService) {

   }

   public getGames(limit: number, skip: number, sort: {active: string, direction: string}| null): any {
    let direction = -1
    if(sort != null){
    if (sort.direction === "ASC"){
      direction = 1
    }
    return this._feathers.service('games').watch().find({
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

   getSetsForGame(gameId: string){
    this._feathers.service('sets').watch().find({
      query: {
        game_id: gameId
      }
    }).subscribe((data:any)=> {
      console.log(data)
    })
   }

  
}
