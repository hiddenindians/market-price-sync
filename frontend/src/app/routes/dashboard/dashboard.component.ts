import { Component, OnInit, ViewChild } from '@angular/core'
import { FeathersService } from '../../services/api/feathers.service'
import { DataService } from '../../services/data/data.service'
import { Subscription } from 'rxjs'
import { DataTableComponent } from '../../shared/data-table/data-table.component'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataTableComponent, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit {
  games: any[] = []
  displayedColumns: string[]  = ['logo','name', 'external_id.tcgcsv_id']


  constructor(private data: DataService) {}
  ngOnInit() {
   this.fetchGames(10,0)
  }

  fetchGames(limit: number, skip: number) {
    this.data.getGames(limit, skip).subscribe((data: any) => {
      this.games = data.data
      console.log('Fetched games:', this.games); // Verify data is fetched
    })
  }

  onPageChange(event: any) {
    const limit = event.pageSize;
    const skip = event.pageIndex * event.pageSize;
    this.fetchGames(limit, skip);
  }
}
