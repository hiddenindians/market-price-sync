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
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from '../../services/auth/auth.service'
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox'
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
    MatButtonModule,
    MatCheckboxModule
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
    'pos_id',
    'ecom_pid'
  ]
  pageSize: number = 10
  pageIndex: number = 0
  totalLength: number = 0
  defaultSort = { active: 'sort_number', direction: 'ASC' }
  selectedGame!: string
  selectedSet!: string
  CAD: number = 1.36
  userSubscription: any
  storeId: string = ''
  newOnlyForSet: boolean = false
  newOnlyForGame: boolean = false

  constructor(private data: DataService, private auth: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.auth.currentUser.subscribe((user: any) => {
      console.log(user.user)
      this.storeId = user.user.store_id
      console.log(this.storeId)
    })

    this.fetchGames(100000, this.pageIndex * this.pageSize, {
      active: 'external_id.tcgcsv_id',
      direction: 'ASC'
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

  search(term: string) {
    if (!term) {
    }
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
    })
  }

  fetchProducts(
    limit: number,
    skip: number,
    sort: { active: string; direction: string } | null,
    setId?: string,
    gameId?: string
  ) {
    if (sort && sort.direction != '') {
      if (setId && setId != '') {
        this.data.getProductsForSet(setId, limit, skip, sort).then((data: any) => {
          this.products = data.data
          this.totalLength = data.total
        })
      } else if (gameId && gameId != '') {
        this.data.getProductsForGame(gameId, limit, skip, sort).then((data: any) => {
          this.products = data.data
          this.totalLength = data.total
        })
      }
    }
  }

  importRetailCSV(event: Event) {
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files
    if (fileList) {
      Papa.parse(fileList[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => this.processRetailCSV(results)
      })
    }
  }
  importEComCSV(event: Event){
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files
    if (fileList) {
      Papa.parse(fileList[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => this.processEComCSV(results)
      })
    }
  }

  async processEComCSV(results: any){
    const products = results.data
    const batchSize = 
    console.log(results.data.length)


    await Promise.all(
      products.map(async (product: any) => {
        try {
          console.log('tryin')
          const byIds = await this.data.getProductByEComIDs(this.storeId, product.Internal_ID, product.Internal_Variant_ID) 
          console.log(byIds)
          if (byIds.total === 1){
            //found on ecom details
            console.log('found on ids')
            let foundProduct = byIds.data[0]
            console.log(foundProduct)

            this.data.patchProduct(foundProduct._id, {
              [`store_status.${this.storeId}.ecom_pid`]: product['Internal_ID'],
              [`store_status.${this.storeId}.ecom_vid`]: product['Internal_Variant_ID'],
            } )

          } else {
            console.log('try again')

            // try {
              console.log(product['EN_Title_Long'])
              const byName = await this.data.getProduct({
                name: product['EN_Title_Long']
              })

              if(byName.total === 1){
                //found by name
                console.log('found by name')

                let foundProduct = byName.data[0]
                this.data.patchProduct(foundProduct._id, {
                  [`store_status.${this.storeId}.ecom_pid`]: product['Internal_ID'],
                  [`store_status.${this.storeId}.ecom_vid`]: product['Internal_Variant_ID'],
                } )
              } else {
                //no match
                console.log(`No match for ${product['EN_Title_Long']}`)
              }
            // }
            // catch(error: any){
            //   console.error(error)
            // }
          }
        }
        catch(error: any){
          console.error(error)
        }
      })
    )
    alert('done processing')
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
  async processRetailCSV(results: any) {
    const products = results.data
    const priceChanges: {}[] = []
    const largeChanges: {}[] = []
    const noMatch: {}[] = []

    console.log(products)

    await Promise.all(
      products.map(async (product: any) => {
        try {
          const data = await this.data.getProductByPOSId(product['System ID'], this.storeId)
          if (data.total === 1) {
            //found by System ID
            console.log('foundbysysid')
            const oldPrice = Number(product.MSRP)
            const newPrice = this.retailPrice(this.getExchangeRate(data.data[0].market_price))
            if (product['Qty.']) {
              this.data.patchProduct(data.data[0]._id, {
                // average_cost: product.avg_cost ? product.avg_cost : 0,
                [`store_status.${this.storeId}.selling.enabled`]: true,
                [`store_status.${this.storeId}.selling.quantity`]: product['Qty.']
              })
            }
            priceChanges.push({ ...product, new_price: newPrice })

            if (Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
              largeChanges.push({ ...product, new_price: newPrice })
            }
          } else if(data.total === 0) {
            console.log('no match on sysID')
            let name = product.Item ? product.Item : product.Description

            const nameData = await this.data.getProduct({
              name: name
            })
            if (nameData.total === 1) {
              // Found by name
              const newPrice = this.retailPrice(this.getExchangeRate(nameData.data[0].market_price))
              const oldPrice = Number(product.MSRP)
              let patchBody = {
                [`store_status.${this.storeId}.pos_id`]: product['System ID'],
                [`store_status.${this.storeId}.selling.enabled`]: true
              }
              if (product['Qty']) {
                patchBody[`store_status.${this.storeId}.selling.quantity`] = product['Qty.']
              }
              this.data.patchProduct(nameData.data[0]._id, patchBody)

              if (Math.abs(newPrice - oldPrice) > 0) {
                priceChanges.push({ ...product, new_price: newPrice })
              }

              if (Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
                largeChanges.push({ ...product, new_price: newPrice })
              }
            } else if (nameData.total == 0) {
              noMatch.push(product)
            } else {
              //multiple matches
              data.data.forEach((element: { name: any }) => {
                console.log(`Duplicate value found from search on name: ${element.name} `)
              });
            }
          } else {
            //multiple matches
            data.data.forEach((element: { name: any }) => {
              console.log(`Duplicate value found from search on SystemID: ${element.name} `)
            });
          }
        } catch (error) {
          console.error('Error processing product:', product, error)
        }
      })

    )
console.log(noMatch)
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

  async exportSellingBySet() {
    const data = await this.data.getSellingForSet(this.selectedSet, this.storeId, this.newOnlyForSet)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId)
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(csv, 'tcg_prices_set.csv', 'text/csv;charset=utf-8')
    }
  }

  async exportSellingByGame() {
    const data = await this.data.getSellingForGame(this.selectedGame, this.storeId, this.newOnlyForGame)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId)
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(csv, 'tcg_prices_game.csv', 'text/csv;charset=utf-8')
    }
  }

  async processProducts(products: any[], storeId: string) {
    return Promise.all(
      products.map(async (product: any) => {
        let object: any = {}
        const marketPrice = product.market_price

        object.description = product.name
        object.quantity = product.store_status[this.storeId].selling.quantity
        object.default_price = this.round(this.retailPrice(this.getExchangeRate(marketPrice)))
        object.msrp = this.round(this.retailPrice(this.getExchangeRate(marketPrice)))
        object.online_price = this.round(this.retailPrice(this.getExchangeRate(marketPrice)))
        object.category = 'Trading Card Games'

        object.subcategory1 = await this.data.getGameNameFromId(product.game_id)
        object.subcategory2 = product.type

        if (product.type === 'Single Cards') {
          object.subcategory3 = await this.data.getSetNameFromId(product.set_id)
        }

        object.system_id = product.store_status[storeId].pos_id || ''
        object.enabled_on_eCom = 'yes'
        object.ecom_id = product.store_status[storeId].ecom_pid || ''
        object.ecom_variant_id = product.store_status[storeId].ecom_vid || ''
        object.ecom_description = `
        ${product.extended_data
          .map((element: { display_name: any; value: any }) => {
            return `
              <tr>
                <td>
                  ${element.display_name}
                </td>
                <td>
                  ${element.value}
                </td>
              </tr>
            `
          })
          .join('')}
      `
        object.image = product.image_url.slice(-15)
        object.image_URL = product.image_url
        return object
      })
    )
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    const limit = event.pageSize
    const skip = event.pageIndex * event.pageSize
    if (this.selectedSet) {
      this.fetchProducts(limit, skip, this.defaultSort, this.selectedSet, '')
    } else {
      this.fetchProducts(limit, skip, this.defaultSort, '', this.selectedGame)
    }
  }

  onSortChange(event: { active: string; direction: string } | null) {
    if (this.selectedSet) {
      if (event) {
        this.defaultSort = event
      }
      this.fetchProducts(this.pageSize, this.pageIndex * this.pageSize, event, this.selectedSet)
    } else {
      if (event) {
        this.defaultSort = event
      }
      this.fetchProducts(this.pageSize, this.pageIndex * this.pageSize, event, undefined, this.selectedGame)
    }
  }

  onGameSelectionChange(event: MatSelectChange) {
    this.selectedGame = event.value
    this.fetchProducts(this.pageSize, this.pageIndex, this.defaultSort, '', event.value)
    this.fetchSets(event.value)
  }

  onSetSelectionChange(event: MatSelectChange) {
    this.selectedSet = event.value
    this.fetchProducts(this.pageSize, this.pageIndex, this.defaultSort, event.value, '')
  }

  onSellToggle(event: { id: string; storeId: string; value: boolean }) {
    this.data.updateSellingStatus(event.id, event.storeId, event.value)
  }

  onBuyToggle(event: { id: string; storeId: string; value: boolean }) {
    this.data.updateBuyingStatus(event.id, event.storeId, event.value)
  }

  onBuyQuantityChange(event: { id: string; storeId: string; value: number }) {
    this.data.updateBuyingQuantity(event.id, event.storeId, event.value)
  }

  onSellQuantityChange(event: { id: string; storeId: string; value: number }) {
    this.data.updatSellingQuantity(event.id, event.storeId, event.value)
  }

  onNewOnlyToggle(event: MatCheckboxChange, type: string) {
    if (event.checked == true) {
      if (type == 'set') {
        this.newOnlyForSet = true
      } else {
        this.newOnlyForGame = true
      }
    }
  }

  round(value: number) {
    return Number(Math.round(Number(value + 'e' + 2)) + 'e-' + 2)
  }
}
