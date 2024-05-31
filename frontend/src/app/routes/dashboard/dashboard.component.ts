import { Component, OnInit } from '@angular/core';
import { FeathersService } from '../../services/api/feathers.service';
import { DataService } from '../../services/data/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit {

  constructor(private data: DataService){}
  ngOnInit(){
   this.data.getGames().subscribe((data:any) => {
    console.log(data)
   })
  }
}
