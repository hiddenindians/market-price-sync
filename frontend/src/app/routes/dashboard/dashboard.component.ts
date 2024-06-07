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
  }


}
