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
import {animate, state, style, transition, trigger} from '@angular/animations';

import { MatTableDataSource } from '@angular/material/table'
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatSlideToggle, MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card';
import { CurrencyService } from '../../services/currency/currency.service'
@Component({
    selector: 'app-data-table',
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatInputModule, MatCardModule
    ],
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
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
  @Input() gameLookup: Record<string, string> = {}
  @Input() setLookup: Record<string, string> = {}
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>()
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatSlideToggle) sToggle!: MatSlideToggle
  @Output() sortChanged = new EventEmitter<{ active: string; direction: string } | null>()
  @Output() buyToggle = new EventEmitter<{ id: string; storeId: string; value: boolean, condition: string }>()
  @Output() sellToggle = new EventEmitter<{ id: string; storeId: string; value: boolean, condition: string }>()
  @Output() buyQuantity = new EventEmitter<{ id: string; storeId: string; value: number, condition: string }>()
  @Output() sellQuantity = new EventEmitter<{ id: string; storeId: string; value: number, condition: string }>()
  
  
  headerMapping: { [key: string]: string } = {
    name: 'Name',
    collector_number: 'Collector Number',
    market_price: 'Market Price',
    image_url: 'Image',
    buylist_price: 'Buylist Price',
    'store_status.near_mint.buying.enabled': 'Buylist Enabled',
    'store_status.near_mint.buying.quantity': 'Buylist Quantity',
    'store_status.near_mint.selling.enabled': 'Selling Enabled',
    'store_status.near_mint.selling.quantity': 'Selling Quantity',
    // Add more mappings as needed
  }

  constructor(private currency: CurrencyService) {
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
    }
   
  }
  getNestedValue(element: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], element)
  }

  getGameName(gameId: string): string {
    return this.gameLookup?.[gameId] ?? gameId ?? ''
  }

  getSetName(setId: string): string {
    return this.setLookup?.[setId] ?? setId ?? ''
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

  onQtyChange(element: any, column: string, event: Event, condition: string): void {
    const input = event.target as HTMLInputElement
    const value = parseInt(input.value, 10)
    if (column.includes('selling')) {
      this.sellQuantity.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: value,
        condition: condition
      })
      console.log(condition)
console.log(element.store_status[this.objectKeys(element.store_status)[0]][condition])

      if (value > 0) {
        element.store_status[this.objectKeys(element.store_status)[0]][condition].selling.enabled = true;

        this.sellToggle.emit({
          id: element._id,
          storeId: this.objectKeys(element.store_status)[0],
          value: true,
          condition: condition
        });
      }
    } else if (column.includes('buying')) {
      this.buyQuantity.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: value,
        condition: condition
      })
      if (value > 0) {
        element.store_status[this.objectKeys(element.store_status)[0]][condition].buying.enabled = true;

        this.buyToggle.emit({
          id: element._id,
          storeId: this.objectKeys(element.store_status)[0],
          value: true,
          condition: condition
        });
      }
    }
    // Add any additional logic to handle the quantity change, such as updating the server
  }

  onCheckboxChange(element: any, column: string, event: MatSlideToggleChange, condition: string): void {
    if (column.includes('selling')) {
      this.sellToggle.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: event.checked,
        condition: condition

      })
    } else if (column.includes('buying')) {
      this.buyToggle.emit({
        id: element._id,
        storeId: this.objectKeys(element.store_status)[0],
        value: event.checked,
        condition: condition

      })
    }
  }

  calculateBuylistPrice(marketPrice: number): number {
    return this.currency.convert(marketPrice * 0.6);
  }

  displayPrice(price: number): number {
    return this.currency.convert(price);
  }
}
