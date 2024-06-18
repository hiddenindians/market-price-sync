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
import { MatSlideToggle, MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'
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
  @ViewChild(MatSlideToggle) sToggle!: MatSlideToggle
  @Output() sortChanged = new EventEmitter<{ active: string; direction: string } | null>()
  @Output() buyToggle = new EventEmitter<{ id: string; storeId: string; value: boolean }>()
  @Output() sellToggle = new EventEmitter<{ id: string; storeId: string; value: boolean }>()
  @Output() buyQuantity = new EventEmitter<{ id: string; storeId: string; value: number }>()
  @Output() sellQuantity = new EventEmitter<{ id: string; storeId: string; value: number }>()

  headerMapping: { [key: string]: string } = {
    'store_status.buying.enabled': 'Buylist Enabled',
    'store_status.buying.quantity': 'Buylist Quantity',
    'store_status.selling.enabled': 'Selling Enabled',
    'store_status.selling.quantity': 'Selling Quantity',
    name: 'Name',
    collector_number: 'Collector Number',
    market_price: 'Market Price',
    image_url: 'Image',
    buylist_price: 'Buylist Price'
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
    if (column.includes('selling')) {
      this.sellQuantity.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: value
      })

      if (value > 0) {
        element.store_status[this.objectKeys(element.store_status)[0]].selling.enabled = true;

        this.sellToggle.emit({
          id: element._id,
          storeId: this.objectKeys(element.store_status)[0],
          value: true
        });
      }
    } else if (column.includes('buying')) {
      this.buyQuantity.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: value
      })
      if (value > 0) {
        element.store_status[this.objectKeys(element.store_status)[0]].buying.enabled = true;

        this.buyToggle.emit({
          id: element._id,
          storeId: this.objectKeys(element.store_status)[0],
          value: true
        });
      }
    }
    // Add any additional logic to handle the quantity change, such as updating the server
  }

  onCheckboxChange(element: any, column: string, event: MatSlideToggleChange): void {
    if (column.includes('selling')) {
      this.sellToggle.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: event.checked
      })
    } else if (column.includes('buying')) {
      this.buyToggle.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: event.checked
      })
    }
  }

  calculateBuylistPrice(marketPrice: number): number {
    return marketPrice * 0.6;
  }
}
