import { Component, OnInit, ViewChild } from '@angular/core'
import { DataService } from '../../services/data/data.service'
import { DataTableComponent } from '../../shared/data-table/data-table.component'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataTableComponent, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  games: any[] = []
  displayedColumns: string[]  = ['store_status.enabled','name']
  totalLength: number = 0
  pageSize: number = 10;
  pageIndex: number = 0;
  defaultSort =  {active: "external_id.tcgcsv_id", direction: "ASC"}

  

  constructor(private data: DataService) {}
  ngOnInit() {
    this.fetchGames(this.pageSize, this.pageIndex * this.pageSize, this.defaultSort);
  }

  fetchGames(limit: number, skip: number, sort: {active: string, direction: string} | null  ) {
    this.data.getGames(limit, skip, sort).subscribe((data: any) => {
      this.games = data.data
      this.totalLength = data.total
      console.log('Fetched games:', this.games); // Verify data is fetched
      console.log('Fetched total:', this.totalLength);
    })
  }

  

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const limit = event.pageSize;
    const skip = event.pageIndex * event.pageSize;
    this.fetchGames(limit, skip, this.defaultSort);
  }

  onSortChange(event: {active: string, direction: string } | null ){
    console.log(event)
    this.fetchGames(this.pageSize, this.pageIndex * this.pageSize, event)
  }

}
