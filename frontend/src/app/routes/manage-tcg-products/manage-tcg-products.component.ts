import { Component, OnInit, ViewChild } from '@angular/core'
import { DataService } from '../../services/data/data.service'
import { DataTableComponent } from '../../shared/data-table/data-table.component'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { FormsModule } from '@angular/forms'
import Papa from 'papaparse'
import { SelectionChange } from '@angular/cdk/collections'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from '../../services/auth/auth.service'

@Component({
  selector: 'app-manage-tcg-products',
  standalone: true,
  imports: [
    FormsModule,
    DataTableComponent,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './manage-tcg-products.component.html',
  styleUrl: './manage-tcg-products.component.scss'
})
export class ManageTCGProductsComponent implements OnInit {
  games: any[] = []
  sets: any[] = []
  products: any[] = []
  displayedColumns: string[] = [
    'store_status.selling.enabled',
    'store_status.selling.quantity',
    'image_url',
    'name',
    'collector_number',
    'market_price',
    'store_status.buying.enabled',
    'store_status.buying.quantity',
    'buylist_price',
    'pos_id'
  ]
  pageSize: number = 10
  pageIndex: number = 0
  totalLength: number = 0
  defaultSort = { active: 'collector_number', direction: 'ASC' }
  selectedGame!: string
  selectedSet!: string
  CAD: number = 1.38
  userSubscription: any;
  storeId: string = "";

  constructor(private data: DataService, private auth: AuthService) {
    this.userSubscription = this.auth.currentUser.subscribe((user:any)=>{
      this.storeId = user.user.store_id
    })
  }
  ngOnInit() {
    this.fetchGames(100000, this.pageIndex * this.pageSize, {
      active: 'external_id.tcgcsv_id',
      direction: 'ASC'
    })
  }

  fetchGames(limit: number, skip: number, sort: { active: string; direction: string } | null) {
    this.data.getGames(limit, skip, sort).then((data: any) => {
      this.games = data.data
      this.selectedGame = this.games[0]._id
      this.fetchProducts(this.pageSize, skip, this.defaultSort, '', this.games[0]._id)
      this.fetchSets(this.selectedGame)
    })
  }

  fetchSets(gameId: string) {
    this.data.getSetsForGame(gameId).then((data: any) => {
      this.sets = data.data
      console.log(this.sets)
    })
  }

  fetchProducts(
    limit: number,
    skip: number,
    sort: { active: string; direction: string } | null,
    setId?: string,
    gameId?: string
  ) {
    if (setId && setId != '') {
      console.log('getting for set')
      this.data.getProductsForSet(setId, limit, skip, sort).then((data: any) => {
        this.products = data.data
        this.totalLength = data.total
      })
    } else if (gameId && gameId != '') {
      console.log('getting for game')
      this.data.getProductsForGame(gameId, limit, skip, sort).then((data: any) => {
        this.products = data.data
        this.totalLength = data.total
        console.log(this.products)
      })
    }
  }

  importCSV(event: Event) {
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files
    if (fileList) {
      Papa.parse(fileList[0], {
        header: true,
        complete: (results) => this.processCSV(results)
      })
    }
  }
  getExchangeRate(price: number) {
    return price * this.CAD
  }

  retailPrice(price: number): number {
    if (price <= 0.25) {
      return 0.25
    } else if (price > 0.25 && price <= 0.35) {
      return 0.35
    } else if (price > 0.35 && price <= 0.5) {
      return 0.5
    } else {
      return price
    }
  }
  async processCSV(results: any) {
    const products = results.data
    const priceChanges: {}[] = []
    const largeChanges: {}[] = []
    const noMatch: {}[] = []

    await Promise.all(
      products.map(async (product: any) => {
        try {
          const data = await this.data.getProduct({ 
            [`store_status.${this.storeId}.pos_id`]: product['System ID'],
          })

          if (data.total === 1) {
            const marketPrice = Object.keys(data.data[0].price.market_price)[0]
            const oldPrice = Number(product.MSRP)
            const newPrice = this.retailPrice(
              this.getExchangeRate(data.data[0].price.market_price[marketPrice])
            )

            // Found by SystemId
            this.data.patchProduct(data.data[0]._id, {
             // average_cost: product.avg_cost ? product.avg_cost : 0,
             [`store_status.${this.storeId}.selling.enabled`]: true,
             [`store_status.${this.storeId}.selling.quantity`]: product['Qty.']
             });

            priceChanges.push({ ...product, new_price: newPrice })

            if (Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
              largeChanges.push({ ...product, new_price: newPrice })
            }
          } else {
            console.log('no match on sysID')
            console.log(product.Description)

            const nameData = await this.data.getProduct({
              name: product.Item ? product.Item : product.Description
            })

            if (nameData.total !== 0) {
              console.log(nameData.data[0])
              const marketPrice = Object.keys(nameData.data[0].price.market_price)[0]
              const newPrice = this.retailPrice(
                this.getExchangeRate(nameData.data[0].price.market_price[marketPrice])
              )
              const oldPrice = Number(product.MSRP)

              // Found by name
              this.data.patchProduct(nameData.data[0]._id, 
                
                
                {
                [`store_status.${this.storeId}.pos_id`]: product['System ID'],
                [`store_status.${this.storeId}.selling.enabled`]: true,
             [`store_status.${this.storeId}.selling.quantity`]: product['Qty.']
              })

              if (Math.abs(newPrice - oldPrice) > 0) {
                priceChanges.push({ ...product, new_price: newPrice })
              }

              if (Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
                largeChanges.push({ ...product, new_price: newPrice })
              }
            } else {
              noMatch.push(product)
            }
          }
        } catch (error) {
          console.error('Error processing product:', product, error)
        }
      })
    )

    const csv = Papa.unparse(priceChanges)
    this.downloadBlob(csv, 'tcg_prices.csv', 'text/csv;charset=utf-8')
    // showLargeChanges(largeChanges);
  }

  downloadBlob(content: any, filename: string, contentType: string) {
    // Create a blob
    var blob = new Blob([content], { type: contentType })
    var url = URL.createObjectURL(blob)

    // Create a link to download it
    var pom = document.createElement('a')
    pom.href = url
    pom.setAttribute('download', filename)
    pom.click()
  }
  exportCSV() {}

  onPageChange(event: PageEvent) {
    console.log(event)
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    const limit = event.pageSize
    const skip = event.pageIndex * event.pageSize
    if (this.selectedSet) {
      console.log("think there's a set")
      console.log(this.selectedSet)
      this.fetchProducts(limit, skip, this.defaultSort, this.selectedSet, '')
    } else {
      this.fetchProducts(limit, skip, this.defaultSort, '', this.selectedGame)
    }
  }

  onSortChange(event: { active: string; direction: string } | null) {
    console.log(event)
    this.fetchProducts(this.pageSize, this.pageIndex * this.pageSize, event)
  }

  onGameSelectionChange(event: MatSelectChange) {
    this.selectedGame = event.value
    this.fetchProducts(this.pageSize, this.pageIndex, this.defaultSort, '', event.value)
    this.fetchSets(event.value)
  }

  onSetSelectionChange(event: MatSelectChange) {
    this.selectedSet = event.value
    console.log('Page ' + this.pageSize)
    this.fetchProducts(this.pageSize, this.pageIndex, this.defaultSort, event.value, '')
  }

  onSellToggle(event: { id: string; storeId: string; value: boolean }) {
    console.log(event)
    this.data.updateSellingStatus(event.id, event.storeId, event.value)
  }

  onBuyToggle(event: { id: string; storeId: string; value: boolean }) {
    console.log(event)
    this.data.updateBuyingStatus(event.id, event.storeId, event.value)
  }

  onBuyQuantityChange(event: { id: string; storeId: string; value: number }) {
    this.data.updateBuyingQuantity(event.id, event.storeId, event.value)
  }

  onSellQuantityChange(event: { id: string; storeId: string; value: number }) {
    this.data.updatSellingQuantity(event.id, event.storeId, event.value)
  }
}
