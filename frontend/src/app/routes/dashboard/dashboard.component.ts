import { Component, OnInit } from '@angular/core';
import { FeathersService } from '../../services/api/feathers.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit {

  constructor(private _feathers: FeathersService){}
  ngOnInit(){
    
    // let games = this._feathers.getService('games').find().then((gaes: any) => {
    //   console.log(gaes)
    // })

  }
}
