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
    'image_url',
    'name',
    'collector_number',
    'market_price',
    'store_status.selling.enabled',
    'store_status.selling.quantity',
    'buylist_price',
    'store_status.buying.enabled',
    'store_status.buying.quantity',
    'pos_id',
    'ecom_pid'
  ]
  pageSize: number = 50
  pageIndex: number = 0
  totalLength: number = 0
  defaultSort = { active: 'sort_number', direction: 'ASC' }
  selectedGame!: string
  selectedSet!: string
  CAD: number = 1.44
  userSubscription: any
  storeId: string = ''
  newOnlyForSet: boolean = false
  newOnlyForGame: boolean = false
  filteredProducts: any[] = []

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

  filter(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const term = inputElement.value
    if (!term) {
      this.filteredProducts = this.products
    } else {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      )
    }
  }

  search(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const term = inputElement.value
    if (!term) {
      this.fetchProducts(
        this.pageSize,
        this.pageIndex,
        this.defaultSort,
        this.selectedSet,
        this.selectedGame,
        ''
      )
    } else {
      this.fetchProducts(this.pageSize, this.pageIndex, this.defaultSort, '', '', term)
    }
  }

  async fetchGames(limit: number, skip: number, sort: { active: string; direction: string } | null) {
    try {
      const data = await this.data.getGames(limit, skip, sort)
      this.games = data.data
      this.selectedGame = this.games[0]._id
      await this.fetchProducts(this.pageSize, skip, this.defaultSort, '', this.games[0]._id)
      await this.fetchSets(this.selectedGame)
    } catch (error) {
      console.error('Error fetching games: ', error)
    }
  }

  async fetchSets(gameId: string) {
    try {
      const data = await this.data.getSetsForGame(gameId)
      this.sets = data.data
    } catch (error) {
      console.error('Error fetching sets: ', error)
    }
  }

  async fetchProducts(
    limit: number,
    skip: number,
    sort: { active: string; direction: string } | null,
    setId?: string,
    gameId?: string,
    term?: string
  ) {
    if (sort && sort.direction != '') {
      if (setId && setId != '') {
        this.data.getProductsForSet(setId, limit, skip, sort).then((data: any) => {
          console.log(data.data)
          this.products = data.data
          this.filteredProducts = this.products
          this.totalLength = data.total
        })
      } else if (gameId && gameId != '') {
        this.data.getProductsForGame(gameId, limit, skip, sort).then((data: any) => {
          this.products = data.data
          this.filteredProducts = this.products
          this.totalLength = data.total
        })
      } else if (term && term != '') {
        this.data.search(term, sort).then((data: any) => {
          this.products = data.data
          this.filteredProducts = this.products
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
  importEComCSV(event: Event) {
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

  async processEComCSV(results: any) {
    const products = results.data

    await Promise.all(
      products.map(async (product: any) => {
        try {
          let name = product['EN_Title_Long']
          let condition = 'near_mint'
          let found = false
          if (name.endsWith('(LP)')) {
            condition = 'lightly_played'
            name = name.slice(0, -4) // Remove '(LP)' from the end
          } else if (name.endsWith('(MP)')) {
            condition = 'moderately_played'
            name = name.slice(0, -4) // Remove '(MP)' from the end
          } else if (name.endsWith('(HP)')) {
            condition = 'heavily_played'
            name = name.slice(0, -4) // Remove '(HP)' from the end
          } else if (name.endsWith('(DMG)')) {
            condition = 'damaged'
            name = name.slice(0, -5) // Remove '(DMG)' from the end
          }

          if (!found) {
            const byIds = await this.data.getProductByEComIDs(
              this.storeId,
              condition,
              product.Internal_ID,
              product.Internal_Variant_ID
            )
            if (byIds.total === 1) {
              found = true
              //found on ecom details. do thing
              console.log('found on ecom ids')
            }
          }
          if (!found) {
            const bySystemId = await this.data.getProductByPOSId(
              product.manufacturer_sku,
              this.storeId,
              condition
            )

            if (bySystemId.total === 1) {
              found = true
              console.log('found by systemID')
              let foundProduct = bySystemId.data[0]
              await this.data.patchProduct(foundProduct._id, {
                [`store_status.${this.storeId}.${condition}.ecom_pid`]: product['Internal_ID'],
                [`store_status.${this.storeId}.${condition}.ecom_vid`]: product['Internal_Variant_ID']
              })
            }
          }
          if (!found) {
            const byName = await this.data.getProduct({
              name: name
            })
            if (byName.total === 1) {
              found = true
              let foundProduct = byName.data[0]
              await this.data.patchProduct(foundProduct._id, {
                [`store_status.${this.storeId}.${condition}.ecom_pid`]: product['Internal_ID'],
                [`store_status.${this.storeId}.${condition}.ecom_vid`]: product['Internal_Variant_ID']
              })
            }
          }

          if (!found) {
            //no match
            console.log(`No match for ${product['EN_Title_Long']}`)
          }
        } catch (error: any) {
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
    const noMatch: {}[] = []
    console.log(products)

    await Promise.all(
      products.map(async (product: any) => {
        try {
          let name = product.Item || product.Description || product['Item Description']
          let systemId = product['System ID'] || product['Item System ID']
          let quantity = product['Qty.'] || product['Item Metrics Quantity On Hand']
          let cost = Number(product['Item Avg Cost']) || null

          let condition = 'near_mint'
          if (name.endsWith('(LP)')) {
            condition = 'lightly_played'
            name = name.slice(0, -5) // Remove ' (LP)' from the end
          } else if (name.endsWith('(MP)')) {
            condition = 'moderately_played'
            name = name.slice(0, -5) // Remove ' (MP)' from the end
          } else if (name.endsWith('(HP)')) {
            condition = 'heavily_played'
            name = name.slice(0, -5) // Remove ' (HP)' from the end
          } else if (name.endsWith('(DMG)')) {
            condition = 'damaged'
            name = name.slice(0, -6) // Remove ' (DMG)' from the end
          }

          const data = await this.data.getProductByPOSId(systemId, this.storeId, condition)
          if (data.total === 1) {
            //found by System ID
            console.log('foundbysysid')

            const oldPrice = Number(product['Price'].replace('$',""))
            let newPrice = this.retailPrice(this.getExchangeRate(data.data[0].market_price))

            if (condition == 'lightly_played') {
              newPrice = newPrice * 0.9
            } else if (condition == 'moderately_played') {
              newPrice = newPrice * 0.75
            } else if (condition == 'heavily_played') {
              newPrice = newPrice * 0.625
            } else if (condition == 'damaged') {
              newPrice = newPrice * 0.5
            }

            let patchBody = {
              [`store_status.${this.storeId}.${condition}.selling.enabled`]: true,
              [`store_status.${this.storeId}.${condition}.selling.quantity`]: parseInt(quantity)
            }

            if(cost !== null ){
              patchBody[`average_cost`] = cost
            }

            await this.data.patchProduct(data.data[0]._id, patchBody)
            

            if (parseInt(quantity) >= 0 && Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
              priceChanges.push({
                systemId: systemId,
                manufacturer_sku: systemId,
                description: data.data[0].name,
                qty: quantity,
                rarity: data.data[0].rarity,
                average_cost: data.data[0].average_cost,
                price: oldPrice,
                msrp: oldPrice,
                new_price: this.round(newPrice),
                online_price: this.round(newPrice),
                change: `${((oldPrice-newPrice)/oldPrice)*100}%`
              })
            }
          } else if (data.total === 0) {
            const nameData = await this.data.getProduct({
              name: name
            })
            if (nameData.total === 1) {
              // Found by name
              console.log(`Name match successful`)

              let newPrice = this.retailPrice(this.getExchangeRate(nameData.data[0].market_price))
              const oldPrice = Number(product['Price'].replace('$',""))

              if (condition == 'lightly_played') {
                newPrice = newPrice * 0.9
              } else if (condition == 'moderately_played') {
                newPrice = newPrice * 0.75
              } else if (condition == 'heavily_played') {
                newPrice = newPrice * 0.625
              } else if (condition == 'damaged') {
                newPrice = newPrice * 0.5
              }

              let patchBody = {
                [`store_status.${this.storeId}.${condition}.pos_id`]: systemId,
                [`store_status.${this.storeId}.${condition}.selling.enabled`]: true
              }

              if(cost !== null) {
                patchBody[`average_cost`] = cost
              }

              patchBody[`store_status.${this.storeId}.${condition}.selling.quantity`] = parseInt(
                quantity
              )

              await this.data.patchProduct(nameData.data[0]._id, patchBody)

              if (parseInt(quantity) > 0 && Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
                priceChanges.push({
                  systemId: systemId,
                  manufacturer_sku: systemId,
                  description: data.data[0].name,
                  qty: quantity,
                  rarity: data.data[0].rarity,
                  average_cost: data.data[0].average_cost,
                  price: oldPrice,
                  msrp: oldPrice,
                  new_price: this.round(newPrice),
                  online_price: this.round(newPrice),
                  change: `${((oldPrice-newPrice)/oldPrice)*100}%`
                })
              }
            } else if (nameData.total === 0) {
              console.log(`Name match failed for ${name}`)
              noMatch.push(product)
            } else {
              //multiple matches
              console.log('multiple on name')
              data.data.forEach((element: { name: any }) => {
                console.log(`Duplicate value found from search on name: ${element.name} `)
              })
            }
          } else {
            //multiple matches
            data.data.forEach((element: { name: any }) => {
              console.log(`Duplicate value found from search on SystemID: ${element.name} `)
            })
          }
        } catch (error) {
          console.error('Error processing product:', product, error)
        }
      })
    )
    console.log(`no Match: ${noMatch}`)
    const csv = Papa.unparse(priceChanges)
    this.downloadBlob(csv, 'tcg_prices.csv', 'text/csv;charset=utf-8')
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
      const jsonArray = await this.processProducts(data.data, this.storeId, this.newOnlyForSet)
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(csv, 'tcg_prices_set.csv', 'text/csv;charset=utf-8')
    }
  }

  async exportSellingByGame() {
    const data = await this.data.getSellingForGame(this.selectedGame, this.storeId, this.newOnlyForGame)
    console.log(data)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId, this.newOnlyForGame)
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(csv, 'tcg_prices_game.csv', 'text/csv;charset=utf-8')
    }
  }

  async exportSelling() {
    const data = await this.data.getSelling(this.storeId)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId, false)
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(csv, 'tcg_prices_all.csv', 'text/csv;charset=utf-8')
    }
  }

  async processProducts(products: any[], storeId: string, newOnly: boolean) {
    return Promise.all(
      products.map(async (product: any) => {
        console.log(product)
        const marketPrice = product.market_price

        const createObject = async (condition: string, status: any) => {
          let object: any = {}

          object.description = product.name
          object.default_price = this.round(this.retailPrice(this.getExchangeRate(marketPrice)))

          if (condition == 'lightly_played') {
            object.description += ' (LP)'
            object.default_price = this.round(this.retailPrice(this.getExchangeRate(marketPrice)) * 0.9)
          } else if (condition == 'moderately_played') {
            object.description += ' (MP)'
            object.default_price = this.round(this.retailPrice(this.getExchangeRate(marketPrice)) * 0.75)
          } else if (condition == 'heavily_played') {
            object.description += ' (HP)'
            object.default_price = this.round(this.retailPrice(this.getExchangeRate(marketPrice)) * 0.625)
          } else if (condition == 'damaged') {
            object.description += ' (DMG)'
            object.default_price = this.round(this.retailPrice(this.getExchangeRate(marketPrice)) * 0.5)
          }

          object.cost = this.round(object.default_price * .6)
          object.msrp = object.default_price
          object.online_price = object.default_price
          object.category = 'Trading Card Games'

          object.subcategory1 = await this.data.getGameNameFromId(product.game_id)
          object.subcategory2 = product.type

          if (product.type === 'Single Cards') {
            object.subcategory3 = await this.data.getSetNameFromId(product.set_id)
          }

          object.quantity = status?.selling?.quantity || 0
          object.system_id = status?.pos_id || ''
          object.manufacturer_sku = status?.pos_id || ''
          object.enabled_on_eCom = object.quantity > 0 ? 'yes' : 'no'
          object.ecom_id = status?.ecom_pid || ''
          object.ecom_variant_id = status?.ecom_vid || ''
          object.ecom_description = `<table>
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
              <tr>
                <td>Game</td>
                <td>${object.subcategory1}</td>
              </tr>
              <tr>
                <td>Set</td>
                <td>${object.subcategory3}
          </table>

      `
          object.ecom_visibility = "S"
          object.height = 1
          object.width = 7
          object.length = 11
          object.weight = 1
          object.image = product.image_url.slice(-15)
          object.image_URL = product.image_url
          object.condition = condition
          object.google_product_category = "6997"

          return object
        }

        //old code
        //     if (product.type == 'Single Cards') {
        //       const conditions = ['near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged']
        //       const result = []

        //       for (const condition of conditions) {
        //         const status = product.store_status[storeId][condition]
        //         if (status && status.selling.enabled) {
        //           const obj = await createObject(condition, status)
        //           result.push(obj)
        //         }
        //       }

        //       return result.length > 0 ? result : []
        //     } else {
        //       const status = product.store_status[storeId].near_mint
        //       return [await createObject('near_mint', status)]
        //     }
        //   })
        // ).then((results) => results.flat())
        // For non-Single Cards:
        if (product.type !== 'Single Cards') {
          const status = product.store_status?.[storeId]?.near_mint
          // Filter out items with pos_id if newOnly is true
          if (newOnly && status?.pos_id) {
            return [] // Skip items with a pos_id if newOnly is enabled
          }
          if (status && status.selling.enabled && status.selling.quantity > 0) {
            return [await createObject('near_mint', status)]
          }
          return []
        }

        // For Single Cards:
        if (product.type === 'Single Cards') {
          const conditions = ['near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged']
          const result = []

          for (const condition of conditions) {
            const status = product.store_status?.[storeId]?.[condition]
            // Filter out conditions with pos_id if newOnly is true
            if (newOnly && status?.pos_id) {
              continue // Skip this condition if pos_id is present and newOnly is true
            }
            if (status && status.selling.enabled && status.selling.quantity > 0) {
              const obj = await createObject(condition, status)
              result.push(obj)
            }
          }

          return result.length > 0 ? result : []
        }
        return []
      })
    ).then((results) => results.flat())
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
    console.log(event)
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

  onSellToggle(event: { id: string; storeId: string; value: boolean; condition: string }) {
    this.data.updateSellingStatus(event.id, event.storeId, event.value, event.condition)
  }

  onBuyToggle(event: { id: string; storeId: string; value: boolean; condition: string }) {
    this.data.updateBuyingStatus(event.id, event.storeId, event.value, event.condition)
  }

  onBuyQuantityChange(event: { id: string; storeId: string; value: number; condition: string }) {
    this.data.updateBuyingQuantity(event.id, event.storeId, event.value, event.condition)
  }

  onSellQuantityChange(event: { id: string; storeId: string; value: number; condition: string }) {
    this.data.updatSellingQuantity(event.id, event.storeId, event.value, event.condition)
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
