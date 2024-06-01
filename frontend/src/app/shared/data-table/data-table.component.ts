import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.less']
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() totalLength: number = 0;
  @Output() page: EventEmitter<PageEvent> =  new EventEmitter<PageEvent>();
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() {
    this.dataSource = new MatTableDataSource();
    
  }
  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.page.emit(event);
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data;
      
      console.log('Data source updated:', this.dataSource.data); // Verify data is assigned
    }
    if (changes['totalLength'] && this.paginator) {
      console.log('Paginator length set to:', this.paginator.length); // Verify paginator length
    }
  }
  getNestedValue(element: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], element);
  }
}