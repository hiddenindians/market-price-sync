import { Component, OnInit, ViewChild } from '@angular/core'
import { DataService } from '../../services/data/data.service'
import { DataTableComponent } from '../../shared/data-table/data-table.component'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { FormsModule } from '@angular/forms'
import Papa from 'papaparse'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from '../../services/auth/auth.service'
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox'
import { MatCardModule } from '@angular/material/card'
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
  MatCheckboxModule,
  MatCardModule
  ],
  templateUrl: './manage-tcg-products.component.html',
  styleUrl: './manage-tcg-products.component.scss'
})
export class ManageTCGProductsComponent implements OnInit {
  games: any[] = []
  sets: any[] = []
  products: any[] = []
  rarities: string[] = []
  finishTypesList: { key: string; label: string }[] = []
  printVariantsList: { key: string; label: string }[] = []
  eventTypesList: { key: string; label: string }[] = []
  eventFilterMode: 'all' | 'only' | 'exclude' = 'all'
  promoFilterMode: 'all' | 'only' | 'exclude' = 'all'
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
  selectedRarities: string[] = []
  selectedFinishes: string[] = []
  selectedPrintVariants: string[] = []
  selectedEvents: string[] = []
  currentFilterTerm: string = ''
  currentSearchTerm: string = ''
  minPriceInput: string = ''
  maxPriceInput: string = ''
  minPriceFilter: number | null = null
  maxPriceFilter: number | null = null
  CAD: number = 1.41
  userSubscription: any
  storeId: string = ''
  newOnlyForSet: boolean = false
  newOnlyForGame: boolean = false
  filteredProducts: any[] = []
  isExporting = false

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
    const term = inputElement.value || ''
    this.currentFilterTerm = term
    this.applyLocalSearch()
  }

  search(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const term = inputElement.value
    this.currentSearchTerm = term || ''
    if (!term) {
      const skip = this.pageIndex * this.pageSize
      const setId = this.selectedSet || ''
      const gameId = setId ? '' : this.selectedGame
      this.fetchProducts(
        this.pageSize,
        skip,
        this.defaultSort,
        setId,
        gameId,
        ''
      )
    } else {
      const skip = this.pageIndex * this.pageSize
      this.fetchProducts(this.pageSize, skip, this.defaultSort, '', '', term)
    }
  }

  async fetchGames(limit: number, skip: number, sort: { active: string; direction: string } | null) {
    try {
      const data = await this.data.getGames(limit, skip, sort)
      this.games = data.data
      if (!this.games.length) {
        return
      }
      this.selectedGame = this.games[0]._id
      await this.fetchFilters(this.selectedGame)
      await this.fetchProducts(this.pageSize, skip, this.defaultSort, '', this.selectedGame)
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

  async fetchFilters(gameId: string, setId?: string) {
    try {
      const response = await this.data.getProductFilters(gameId, setId)
      this.rarities = response?.rarities ?? []
      this.finishTypesList = response?.finishes ?? []
      this.printVariantsList = response?.prints ?? []
      this.eventTypesList = response?.events ?? []

      this.selectedRarities = this.selectedRarities.filter((rarity) => this.rarities.includes(rarity))
      const validFinishKeys = new Set(this.finishTypesList.map((finish) => finish.key))
      this.selectedFinishes = this.selectedFinishes.filter((finish) => validFinishKeys.has(finish))
      const validPrintKeys = new Set(this.printVariantsList.map((p) => p.key))
      this.selectedPrintVariants = this.selectedPrintVariants.filter((print) => validPrintKeys.has(print))
      const validEventKeys = new Set(this.eventTypesList.map((event) => event.key))
      this.selectedEvents = this.selectedEvents.filter((event) => validEventKeys.has(event))
    } catch (error) {
      console.error('Error fetching filters: ', error)
      this.rarities = []
      this.finishTypesList = []
      this.printVariantsList = []
      this.eventTypesList = []
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
    if (!sort || sort.direction === '') {
      return
    }

    const filters = this.currentFilters()

    if (setId && setId !== '') {
      this.data.getProductsForSet(setId, limit, skip, sort, filters).then((data: any) => {
        this.products = data.data
        this.totalLength = data.total ?? data.data?.length ?? 0
        this.applyLocalSearch()
      })
    } else if (gameId && gameId !== '') {
      this.data.getProductsForGame(gameId, limit, skip, sort, filters).then((data: any) => {
        this.products = data.data
        this.totalLength = data.total ?? data.data?.length ?? 0
        this.applyLocalSearch()
      })
    } else if (term && term !== '') {
      this.data.search(term, sort, filters, { limit, skip }).then((data: any) => {
        this.products = data.data
        this.totalLength = data.total ?? data.data?.length ?? 0
        this.applyLocalSearch()
      })
    }
  }

  applyLocalSearch(term: string = this.currentFilterTerm) {
    const lowerTerm = term.toString().toLowerCase()
    if (!lowerTerm) {
      this.filteredProducts = this.products
      return
    }

    this.filteredProducts = this.products.filter((product: any) =>
      (product.name || '').toString().toLowerCase().includes(lowerTerm)
    )
  }

  currentFilters() {
    const minPrice = this.normalizePriceInput(this.minPriceInput)
    const maxPrice = this.normalizePriceInput(this.maxPriceInput)

    this.minPriceFilter = minPrice
    this.maxPriceFilter = maxPrice

    return {
      rarities: [...this.selectedRarities],
  prints: [...this.selectedPrintVariants],
  finishes: [...this.selectedFinishes],
      events: [...this.selectedEvents],
      onlyEvents: this.eventFilterMode === 'only',
      excludeEvents: this.eventFilterMode === 'exclude',
      onlyPromo: this.promoFilterMode === 'only',
      excludePromo: this.promoFilterMode === 'exclude',
      minPrice: minPrice,
      maxPrice: maxPrice
    }
  }

  onFilterSelectionChange() {
    const skip = this.pageIndex * this.pageSize
    const setId = this.selectedSet || ''
    const gameId = setId ? '' : this.selectedGame
    if (!setId && !gameId) {
      return
    }
    this.fetchProducts(this.pageSize, skip, this.defaultSort, setId, gameId)
  }

  onEventFilterModeChange(event: MatSelectChange) {
    const mode = event.value as 'all' | 'only' | 'exclude'
    this.eventFilterMode = mode
    const skip = this.pageIndex * this.pageSize
    const setId = this.selectedSet || ''
    const gameId = setId ? '' : this.selectedGame
    if (!setId && !gameId) {
      return
    }
    this.fetchProducts(this.pageSize, skip, this.defaultSort, setId, gameId)
  }

  onPromoFilterModeChange(event: MatSelectChange) {
    const mode = event.value as 'all' | 'only' | 'exclude'
    this.promoFilterMode = mode
    const skip = this.pageIndex * this.pageSize
    const setId = this.selectedSet || ''
    const gameId = setId ? '' : this.selectedGame
    if (!setId && !gameId) {
      return
    }
    this.fetchProducts(this.pageSize, skip, this.defaultSort, setId, gameId)
  }

  onPriceFilterChange() {
    const skip = this.pageIndex * this.pageSize
    const setId = this.selectedSet || ''
    const gameId = setId ? '' : this.selectedGame

    if (!setId && !gameId) {
      if (this.currentSearchTerm) {
        this.fetchProducts(this.pageSize, skip, this.defaultSort, '', '', this.currentSearchTerm)
      }
      return
    }

    if (this.currentSearchTerm) {
      this.fetchProducts(this.pageSize, skip, this.defaultSort, '', '', this.currentSearchTerm)
    } else {
      this.fetchProducts(this.pageSize, skip, this.defaultSort, setId, gameId)
    }
  }

  clearPriceFilters() {
    this.minPriceInput = ''
    this.maxPriceInput = ''
    this.minPriceFilter = null
    this.maxPriceFilter = null
    this.onPriceFilterChange()
  }

  private normalizePriceInput(raw: string): number | null {
    const trimmed = (raw ?? '').toString().trim()
    if (!trimmed.length) {
      return null
    }

    const numeric = Number(trimmed)
    if (!Number.isFinite(numeric) || numeric < 0) {
      return null
    }

    return Math.round(numeric * 100) / 100
  }

  importRetailCSV(event: Event) {
    console.time('building retail json object')
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files
    if (fileList) {
      Papa.parse(fileList[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.timeEnd('building retail json object')
          this.processRetailCSV(results)
        }
      })
    }
  }
  importEComCSV(event: Event) {
    console.time('building ecom json object')
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files
    if (fileList) {
      Papa.parse(fileList[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.timeEnd('building ecom json object')
          this.processEComCSV(results)
        }
      })
    }
  }

  async processEComCSV(results: any) {
    console.time('processing ecom json object')
    const products = results.data

    await Promise.all(
      products.map(async (product: any) => {
        try {
          let category = product['EN_Category_3']
          if (category !== 'Single Cards') {
            return
          }

          let name = product['EN_Title_Long']
          let condition = 'near_mint'
          let found = false
          if (name.endsWith('(LP)')) {
            console.log(name)
            condition = 'lightly_played'
            name = name.slice(0, -5) // Remove ' (LP)' from the end
            console.log(name)
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
            console.log('by name: ' + name)
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
    console.timeEnd('processing ecom json object')
    alert('done processing')
  }
  getExchangeRate(price: number) {
    if (price == -1) {
      return -1
    } else {
      return price * this.CAD
    }
  }

  retailPrice(price: number): number {
    if (price == -1) {
      return -1
    } else if (price <= 0.25) {
      return 0.25
    } else if (price > 0.25 && price <= 0.35) {
      return 0.35
    } else if (price > 0.35 && price <= 0.5) {
      return 0.5
    } else {
      return price
    }
  }

  private conditionSuffix(condition: string): string {
    const map: Record<string, string> = {
      lightly_played: ' (LP)',
      moderately_played: ' (MP)',
      heavily_played: ' (HP)',
      damaged: ' (DMG)'
    }
    return map[condition] ?? ''
  }

  private adjustPriceForCondition(price: number, condition: string): number {
    if (price < 0) {
      return price
    }

    const multipliers: Record<string, number> = {
      lightly_played: 0.9,
      moderately_played: 0.75,
      heavily_played: 0.625,
      damaged: 0.5
    }

    const multiplier = multipliers[condition] ?? 1
    return price * multiplier
  }

  async processRetailCSV(results: any) {
    console.time('processing retail json object')
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
          let price = product['Price']
            ? Number(product['Price'].replace('$', ''))
            : Number(product['Item Metrics Price'])

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

            const oldPrice = price
            let newPrice = this.retailPrice(this.getExchangeRate(data.data[0].market_price))
            newPrice = this.adjustPriceForCondition(newPrice, condition)

            let patchBody = {
              [`store_status.${this.storeId}.${condition}.selling.enabled`]: true,
              [`store_status.${this.storeId}.${condition}.selling.quantity`]: parseInt(quantity)
            }

            if (cost !== null) {
              patchBody[`store_status.${this.storeId}.${condition}.average_cost`] = cost
            }

            await this.data.patchProduct(data.data[0]._id, patchBody)
            console.log(data.data[0].store_status[this.storeId][condition].average_cost)

            if (parseInt(quantity) >= 0 && Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
              priceChanges.push({
                systemId: systemId,
                manufacturer_sku: systemId,
                description: `${data.data[0].name}${this.conditionSuffix(condition)}`,
                qty: quantity,
                rarity: data.data[0].rarity,
                average_cost: data.data[0].store_status[this.storeId][condition].average_cost,
                price: oldPrice,
                msrp: oldPrice,
                new_price: this.round(newPrice),
                online_price: this.round(newPrice),
                change: `${((oldPrice - newPrice) / oldPrice) * 100}%`,
                condition
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
              const oldPrice = price
              newPrice = this.adjustPriceForCondition(newPrice, condition)

              let patchBody = {
                [`store_status.${this.storeId}.${condition}.pos_id`]: systemId,
                [`store_status.${this.storeId}.${condition}.selling.enabled`]: true
              }

              if (cost !== null) {
                patchBody[`store_status.${this.storeId}.${condition}.average_cost`] = cost
              }

              patchBody[`store_status.${this.storeId}.${condition}.selling.quantity`] = parseInt(quantity)

              await this.data.patchProduct(nameData.data[0]._id, patchBody)

              console.log(nameData.data[0].store_status[this.storeId][condition].average_cost)
              if (parseInt(quantity) > 0 && Math.abs(newPrice - oldPrice) > oldPrice * 0.05) {
                priceChanges.push({
                  systemId: systemId,
                  manufacturer_sku: systemId,
                  description: `${nameData.data[0].name}${this.conditionSuffix(condition)}`,
                  qty: quantity,
                  rarity: nameData.data[0].rarity,
                  average_cost: nameData.data[0].store_status[this.storeId][condition].average_cost,
                  price: oldPrice,
                  msrp: oldPrice,
                  new_price: this.round(newPrice),
                  online_price: this.round(newPrice),
                  change: `${((oldPrice - newPrice) / oldPrice) * 100}%`,
                  condition
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

    for (const no of noMatch) {
      console.log(`no Match: ${no}`)
    }
    console.timeEnd('processing retail json object')
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

          object.cost = object.default_price >= 1 ? this.round(object.default_price * 0.6) : 0.05
          object.msrp = object.default_price
          object.online_price = object.default_price
          object.category = 'Trading Card Games'

          object.subcategory1 = await this.data.getGameNameFromId(product.game_id)
          object.subcategory2 = 'Single Cards'

          if (product.type === 'Single Cards' || product.type === 'Presale') {
            object.subcategory3 = await this.data.getSetNameFromId(product.set_id)
          }

          object.quantity = status?.selling?.quantity || 0
          object.system_id = status?.pos_id || ''
          object.manufacturer_sku = status?.pos_id || ''
          object.enabled_on_eCom = object.quantity > 0 ? 'yes' : 'no'
          object.ecom_id = status?.ecom_pid || ''
          object.ecom_variant_id = status?.ecom_vid || ''
          const rawHTML = `<table>
  ${product.extended_data
    .map((element: { display_name: any; value: any }) => {
      return `
        <tr>
          <td>${element.display_name}</td>
          <td>${element.value}</td>
        </tr>
      `
    })
    .join('')} 
    <tr><td>Condition</td><td>${condition.replace('_', ' ')}</td></tr>         
    <tr><td>Game</td><td>${object.subcategory1}</td></tr>
    <tr><td>Set</td><td>${object.subcategory3}</td></tr>
</table>`

          // Replace commas and optionally line breaks
          const safeHTML = rawHTML
            .replace(/,/g, '&#44;') // escape commas
            .replace(/\r?\n|\r/g, ' ') // optional: remove line breaks

          object.ecom_description = safeHTML
          object.ecom_visibility = 'S'
          object.height = 1
          object.width = 7
          object.length = 11
          object.weight = 1
          object.image = product.image_url.slice(-15)
          object.image_URL = product.image_url
          object.condition = condition
          object.google_product_category = '6997'

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
    this.selectedSet = ''
    this.selectedRarities = []
  this.selectedFinishes = []
  this.selectedPrintVariants = []
    this.selectedEvents = []
    this.eventFilterMode = 'all'
    this.promoFilterMode = 'all'
    this.currentSearchTerm = ''
    this.minPriceInput = ''
    this.maxPriceInput = ''
    this.minPriceFilter = null
    this.maxPriceFilter = null
    this.pageIndex = 0
    this.fetchFilters(this.selectedGame)
    this.fetchProducts(this.pageSize, 0, this.defaultSort, '', this.selectedGame)
    this.fetchSets(event.value)
  }

  private getStoreCondition(product: any, condition: string) {
    if (!product?.store_status) {
      return {}
    }

    const storeKey = this.storeId && product.store_status[this.storeId]
      ? this.storeId
      : Object.keys(product.store_status)[0]

    if (!storeKey) {
      return {}
    }

    return product.store_status[storeKey]?.[condition] ?? {}
  }

  private buildExportRows(products: any[]) {
    return products.map((product: any) => {
      const nearMint = this.getStoreCondition(product, 'near_mint')
      const events = Array.isArray(product.event_types) ? product.event_types : []

      return {
        name: product.name ?? '',
        collector_number: product.collector_number ?? '',
        rarity: product.rarity ?? '',
        print: product.print ?? '',
  finish: product.finish ?? '',
        market_price: product.market_price ?? '',
        low_price: product.low_price ?? '',
        mid_price: product.mid_price ?? '',
        high_price: product.high_price ?? '',
        event_types: events.join('|'),
        is_promo: events.includes('promo') ? 'yes' : 'no',
        is_pre_release: events.includes('pre_release') ? 'yes' : 'no',
        is_release: events.includes('release') ? 'yes' : 'no',
        is_anniversary: events.includes('anniversary') ? 'yes' : 'no',
        store_pos_id: nearMint.pos_id ?? '',
        store_ecom_pid: nearMint.ecom_pid ?? '',
        store_ecom_vid: nearMint.ecom_vid ?? '',
        store_selling_enabled: nearMint.selling?.enabled ?? false,
        store_selling_quantity: nearMint.selling?.quantity ?? 0,
        store_buying_enabled: nearMint.buying?.enabled ?? false,
        store_buying_quantity: nearMint.buying?.quantity ?? 0
      }
    })
  }

  private sanitizeFileName(value: string) {
    return (value || 'results').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase() || 'results'
  }

  private filterExportProducts(products: any[]) {
    if (!this.currentFilterTerm) {
      return products
    }

    const normalized = this.currentFilterTerm.toString().toLowerCase()
    return products.filter((product: any) => (product.name ?? '').toString().toLowerCase().includes(normalized))
  }

  private resolveExportFilename() {
    if (this.currentSearchTerm) {
      return `search_${this.sanitizeFileName(this.currentSearchTerm)}.csv`
    }

    if (this.selectedSet) {
      const setName = this.sets.find((set) => set._id === this.selectedSet)?.name ?? this.selectedSet
      return `set_${this.sanitizeFileName(setName)}.csv`
    }

    if (this.selectedGame) {
      const gameName = this.games.find((game) => game._id === this.selectedGame)?.name ?? this.selectedGame
      return `game_${this.sanitizeFileName(gameName)}.csv`
    }

    return `products_${Date.now()}.csv`
  }

  async exportResults() {
    this.isExporting = true
    const batchSize = 500
    const filters = this.currentFilters()
    const sort = this.defaultSort
    let skip = 0
    let total: number | null = null
    const aggregated: any[] = []
    const extractBatch = (response: any) => (Array.isArray(response) ? response : response?.data ?? [])

    try {
      if (this.currentSearchTerm) {
        while (true) {
          const response = await this.data.search(this.currentSearchTerm, sort, filters, {
            limit: batchSize,
            skip
          })
          const batch = extractBatch(response)
          aggregated.push(...batch)
          if (typeof response?.total === 'number') {
            total = response.total
          }

          const fetchedAllByTotal = total !== null && aggregated.length >= total
          const fetchedAllByBatch = batch.length < batchSize

          if (!batch.length || fetchedAllByTotal || fetchedAllByBatch) {
            break
          }
          skip += batch.length
        }
      } else if (this.selectedSet) {
        while (true) {
          const response = await this.data.getProductsForSet(
            this.selectedSet,
            batchSize,
            skip,
            sort,
            filters
          )
          const batch = extractBatch(response)
          aggregated.push(...batch)
          if (typeof response?.total === 'number') {
            total = response.total
          }

          const fetchedAllByTotal = total !== null && aggregated.length >= total
          const fetchedAllByBatch = batch.length < batchSize

          if (!batch.length || fetchedAllByTotal || fetchedAllByBatch) {
            break
          }
          skip += batch.length
        }
      } else if (this.selectedGame) {
        while (true) {
          const response = await this.data.getProductsForGame(
            this.selectedGame,
            batchSize,
            skip,
            sort,
            filters
          )
          const batch = extractBatch(response)
          aggregated.push(...batch)
          if (typeof response?.total === 'number') {
            total = response.total
          }

          const fetchedAllByTotal = total !== null && aggregated.length >= total
          const fetchedAllByBatch = batch.length < batchSize

          if (!batch.length || fetchedAllByTotal || fetchedAllByBatch) {
            break
          }
          skip += batch.length
        }
      }

      if (!aggregated.length) {
        return
      }

      const exportProducts = this.filterExportProducts(aggregated)
      const csvRows = this.buildExportRows(exportProducts)
      const csv = Papa.unparse(csvRows)
      const filename = this.resolveExportFilename()
      this.downloadBlob(csv, filename, 'text/csv;charset=utf-8')
    } catch (error) {
      console.error('Error exporting results', error)
    } finally {
      this.isExporting = false
    }
  }

  onSetSelectionChange(event: MatSelectChange) {
    this.selectedSet = event.value
    this.currentSearchTerm = ''
    this.pageIndex = 0
    this.fetchFilters(this.selectedGame, this.selectedSet)
    this.fetchProducts(this.pageSize, 0, this.defaultSort, this.selectedSet, '')
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
