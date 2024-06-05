import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatInputModule } from '@angular/material/input'
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatInputModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnChanges {
  isServerSideSorting: boolean = true
  objectKeys = Object.keys
  @Input() data: any[] = []
  @Input() displayedColumns: string[] = []
  @Input() totalLength: number = 0
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>()
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @Output() sortChanged = new EventEmitter<{ active: string; direction: string } | null>()
  @Output() buyToggle = new EventEmitter<MatSlideToggleChange>()
  @Output() sellToggle = new EventEmitter<{id: string, storeId: string, value: boolean}>()

  headerMapping: { [key: string]: string } = {
    'store_status.buying.enabled': 'Buying Enabled',
    'store_status.buying.quantity': 'Buying Quantity',
    'store_status.selling.enabled': 'Selling Enabled',
    'store_status.selling.quantity': 'Selling Quantity',
    name: 'Name',
    collector_number: 'Collector Number',
    market_price: 'Market Price',
    image_url: 'Image'
    // Add more mappings as needed
  }

  constructor() {
    this.dataSource = new MatTableDataSource()
  }
  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.page.emit(event)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data

      console.log('Data source updated:', this.dataSource.data) // Verify data is assigned
    }
    if (changes['totalLength'] && this.paginator) {
      console.log('Paginator length set to:', this.paginator.length) // Verify paginator length
    }
  }
  getNestedValue(element: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], element)
  }

  sortData(event: any) {
    this.sort.sortChange.subscribe((event) => {
      if (this.isServerSideSorting) {
        // Emit parameters for server-side sorting
        let sortParam = null
        if (event.direction === 'asc' || event.direction === 'desc') {
          sortParam = { active: event.active, direction: event.direction.toUpperCase() }
        }
        this.sortChanged.emit(sortParam)
      } else {
        // Handle client-side sorting
        // this.clientSideSorting(event.active, event.direction);
      }
    })
  }

  onQtyChange(element: any, column: string, event: Event): void {
    const input = event.target as HTMLInputElement
    const value = parseInt(input.value, 10)
    const keys = column.split('.')
    let obj = element
    for (let i = 0; i < keys.length - 1; i++) {
      obj = keys[i]
    }
    obj[keys[keys.length - 1]] = value
    // Add any additional logic to handle the quantity change, such as updating the server
  }

  onCheckboxChange(element: any, column: string, event: MatSlideToggleChange): void {
    const checked = event.checked
    const keys = column.split('.')

    // let obj = element;
    // for (let i = 0; i < keys.length - 1; i++) {
    //   obj = obj[keys[i]];
    // }
    // obj[keys[keys.length - 1]] = checked;
    console.log(event)
    console.log(column)
    if (column.includes('selling')) {
      this.sellToggle.emit({id: element._id, storeId: this.objectKeys(element.store_status)[0], value: event.checked})
    } else if (column.includes('buying')) {

    }
    this.data = this.data
    // Add any additional logic to handle the checkbox change, such as updating the server
  }
}
