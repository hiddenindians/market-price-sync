import { Component, HostListener, OnInit, ViewChild } from '@angular/core'

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
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { UnmatchedProductDialogComponent } from './unmatched-product-dialog.component'
import { CurrencyToggleComponent } from '../../shared/currency-toggle/currency-toggle.component'
import { CurrencyService } from '../../services/currency/currency.service'
@Component({
    selector: 'app-manage-tcg-products',
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
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    CurrencyToggleComponent
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
  userSubscription: any
  storeId: string = ''
  newOnlyForSet: boolean = false
  newOnlyForGame: boolean = false
  filteredProducts: any[] = []
  isExporting = false
  isProcessing = false
  processingPhase: 'idle' | 'parsing' | 'processing' | 'done' = 'idle'
  processingType: 'retail' | 'ecom' | null = null
  totalRows = 0
  processedRows = 0
  matchedRows = 0
  updatedRows = 0
  skippedRows = 0
  errorRows = 0
  processingMessage = ''
  unmatchedRows: UnmatchedRow[] = []
  unmatchedStorageKey = 'tcg_unmatched_rows_v1'
  showAllUnmatched = false
  unmatchedVisibleLimit = 200
  conditionOptions = ['near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged']
  showBackToTop = false
  gameLookup: Record<string, string> = {}
  setLookup: Record<string, string> = {}

  constructor(
    private data: DataService,
    private auth: AuthService,
    private dialog: MatDialog,
    private currency: CurrencyService
  ) {
    this.debouncedSearch = this.debounce(this.executeSearch.bind(this), 300)
  }

  private debounce = (func: Function, wait: number) => {
    let timeout: any
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  private debouncedSearch: (...args: any[]) => void

  get progressPercent() {
    if (!this.totalRows) {
      return 0
    }
    return Math.round((this.processedRows / this.totalRows) * 100)
  }

  get unmatchedCount() {
    return this.unmatchedRows.length
  }

  get visibleUnmatchedRows() {
    if (this.showAllUnmatched) {
      return this.unmatchedRows
    }
    return this.unmatchedRows.slice(0, this.unmatchedVisibleLimit)
  }

  ngOnInit() {
    this.loadPersistedUnmatchedRows()
    this.userSubscription = this.auth.currentUser.subscribe((user: any) => {
      if (!user?.user?.store_id) {
        return
      }
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

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showBackToTop = window.scrollY > 400
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  filter(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const term = inputElement.value || ''
    this.currentFilterTerm = term
    this.applyLocalSearch()
  }

  search(event: Event) {
    const inputElement = event.target as HTMLInputElement
    this.debouncedSearch(inputElement.value)
  }

  private executeSearch(term: string) {
    this.currentSearchTerm = term || ''
    if (!term) {
      const skip = this.pageIndex * this.pageSize
      const setId = this.selectedSet || ''
      const gameId = setId ? '' : this.selectedGame
      this.fetchProducts(this.pageSize, skip, this.defaultSort, setId, gameId, '')
    } else {
      const skip = this.pageIndex * this.pageSize
      this.fetchProducts(this.pageSize, skip, this.defaultSort, '', '', term)
    }
  }

  async fetchGames(limit: number, skip: number, sort: { active: string; direction: string } | null) {
    try {
      const data = await this.data.getGames(limit, skip, sort)
      this.games = data.data
      this.gameLookup = this.buildNameLookup(this.games)
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
      this.setLookup = this.buildNameLookup(this.sets)
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
        this.ensureSetLookup(this.products)
        this.applyLocalSearch()
      })
    } else if (gameId && gameId !== '') {
      this.data.getProductsForGame(gameId, limit, skip, sort, filters).then((data: any) => {
        this.products = data.data
        this.totalLength = data.total ?? data.data?.length ?? 0
        this.ensureSetLookup(this.products)
        this.applyLocalSearch()
      })
    } else if (term && term !== '') {
      this.data.search(term, sort, filters, { limit, skip }).then((data: any) => {
        this.products = data.data
        this.totalLength = data.total ?? data.data?.length ?? 0
        this.ensureSetLookup(this.products)
        this.applyLocalSearch()
      })
    }
  }

  private async ensureSetLookup(products: any[]) {
    const missingSetIds = Array.from(
      new Set(
        products
          .map((product) => product?.set_id)
          .filter((setId) => setId && !this.setLookup[setId])
      )
    )

    if (!missingSetIds.length) {
      return
    }

    await Promise.all(
      missingSetIds.map(async (setId) => {
        try {
          const name = await this.data.getSetNameFromId(setId)
          if (name) {
            this.setLookup[setId] = name
          }
        } catch (error) {
          console.error('Error fetching set name', error)
        }
      })
    )
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
    this.beginProcessing('retail')
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files
    if (fileList) {
      Papa.parse(fileList[0], {
        header: true,
        skipEmptyLines: true,
        worker: true,
        complete: (results) => {
          this.initializeProcessing(results.data?.length ?? 0)
          this.processRetailCSV(results)
        }
      })
    }
  }
  importEComCSV(event: Event) {
    this.beginProcessing('ecom')
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files
    if (fileList) {
      Papa.parse(fileList[0], {
        header: true,
        skipEmptyLines: true,
        worker: true,
        complete: (results) => {
          this.initializeProcessing(results.data?.length ?? 0)
          this.processEComCSV(results)
        }
      })
    }
  }

  private beginProcessing(type: 'retail' | 'ecom') {
    this.isProcessing = true
    this.processingPhase = 'parsing'
    this.processingType = type
    this.processingMessage = ''
    this.totalRows = 0
    this.processedRows = 0
    this.matchedRows = 0
    this.updatedRows = 0
    this.skippedRows = 0
    this.errorRows = 0
  }

  private initializeProcessing(totalRows: number) {
    this.processingPhase = 'processing'
    this.totalRows = totalRows
    this.processingMessage = ''
  }

  private finalizeProcessing(message: string) {
    this.processingPhase = 'done'
    this.isProcessing = false
    this.processingMessage = message
  }

  private loadPersistedUnmatchedRows() {
    const raw = window.localStorage.getItem(this.unmatchedStorageKey)
    if (!raw) {
      return
    }
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        this.unmatchedRows = parsed
          .filter((row) => row && typeof row === 'object')
          .map((row, index) => ({
            id: row.id ?? `legacy-${Date.now()}-${index}`,
            importType: row.importType ?? 'retail',
            row: row.row ?? index + 1,
            name: row.name ?? '',
            systemId: row.systemId ?? '',
            condition: row.condition ?? 'near_mint',
            internalId: row.internalId ?? '',
            internalVariantId: row.internalVariantId ?? '',
            manufacturerSku: row.manufacturerSku ?? '',
            category: row.category ?? '',
            quantity: row.quantity ?? '',
            cost: row.cost ?? null,
            price: row.price ?? null,
            reason: row.reason ?? 'no_match',
            status: row.status ?? 'unmatched',
            createdAt: row.createdAt ?? new Date().toISOString(),
            lastUpdatedAt: row.lastUpdatedAt
          }))
      }
    } catch (error) {
      console.error('Failed to load unmatched rows', error)
    }
  }

  private persistUnmatchedRows() {
    try {
      window.localStorage.setItem(this.unmatchedStorageKey, JSON.stringify(this.unmatchedRows))
    } catch (error) {
      console.error('Failed to persist unmatched rows', error)
    }
  }

  private applyProcessResult(result: ProcessResult) {
    if (result.matched) {
      this.matchedRows += 1
    }
    if (result.updated) {
      this.updatedRows += 1
    }
    if (result.skipped) {
      this.skippedRows += 1
    }
    if (result.unmatched) {
      this.recordUnmatched(result.unmatched)
    }
    if (result.error) {
      this.errorRows += 1
    }
  }

  private async processInBatches<T>(
    items: T[],
    batchSize: number,
    handler: (item: T, index: number) => Promise<ProcessResult>
  ) {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      await Promise.all(
        batch.map(async (item, offset) => {
          const index = i + offset
          const result = await handler(item, index).catch((error: any) => {
            console.error(error)
            return { error: true }
          })
          this.applyProcessResult(result)
          this.processedRows += 1
        })
      )
    }
  }

  private recordUnmatched(entry: UnmatchedRow) {
    this.unmatchedRows.push(entry)
    this.persistUnmatchedRows()
  }

  private createUnmatchedRow(
    importType: 'retail' | 'ecom',
    index: number,
    payload: Partial<UnmatchedRow>
  ): UnmatchedRow {
    const now = new Date().toISOString()
    return {
      id: `${importType}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      importType,
      row: index + 1,
      name: payload.name ?? '',
      systemId: payload.systemId ?? '',
      condition: payload.condition ?? 'near_mint',
      internalId: payload.internalId ?? '',
      internalVariantId: payload.internalVariantId ?? '',
      manufacturerSku: payload.manufacturerSku ?? '',
      category: payload.category ?? '',
      quantity: payload.quantity ?? '',
      cost: payload.cost ?? null,
      price: payload.price ?? null,
      reason: payload.reason ?? 'no_match',
      status: 'unmatched',
      createdAt: now,
      lastUpdatedAt: now
    }
  }

  private buildNameLookup(items: any[]) {
    const lookup: Record<string, string> = {}
    items.forEach((item) => {
      if (item?._id && item?.name) {
        lookup[item._id] = item.name
      }
    })
    return lookup
  }

  downloadUnmatchedCsv() {
    if (!this.unmatchedRows.length) {
      return
    }
    const csv = Papa.unparse(
      this.unmatchedRows.map((row) => ({
        id: row.id,
        importType: row.importType,
        row: row.row,
        name: row.name ?? '',
        systemId: row.systemId ?? '',
        condition: row.condition ?? '',
        internalId: row.internalId ?? '',
        internalVariantId: row.internalVariantId ?? '',
        manufacturerSku: row.manufacturerSku ?? '',
        quantity: row.quantity ?? '',
        cost: row.cost ?? '',
        price: row.price ?? '',
        reason: row.reason ?? ''
      }))
    )
    const typeLabel = this.processingType ?? 'import'
    this.downloadBlob(csv, `unmatched_${typeLabel}_${Date.now()}.csv`, 'text/csv;charset=utf-8')
  }

  onUnmatchedEdit(row?: UnmatchedRow) {
    if (row) {
      row.lastUpdatedAt = new Date().toISOString()
    }
    this.persistUnmatchedRows()
  }

  dismissUnmatched(row: UnmatchedRow) {
    this.unmatchedRows = this.unmatchedRows.filter((entry) => entry.id !== row.id)
    this.persistUnmatchedRows()
  }

  copyToClipboard(value: string) {
    const text = value?.toString() ?? ''
    if (!text) {
      return
    }
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch((error) => {
        console.error('Clipboard copy failed', error)
      })
      return
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
    } catch (error) {
      console.error('Clipboard copy failed', error)
    } finally {
      document.body.removeChild(textarea)
    }
  }

  async retryUnmatched(row: UnmatchedRow) {
    if (row.status === 'resolving') {
      return
    }
    if (!this.storeId) {
      return
    }
    row.status = 'resolving'
    this.persistUnmatchedRows()

    try {
      const result =
        row.importType === 'retail'
          ? await this.resolveRetailRow(row)
          : await this.resolveEcomRow(row)

      if (result.matched) {
        this.matchedRows += 1
        if (result.updated) {
          this.updatedRows += 1
        }
        this.skippedRows = Math.max(0, this.skippedRows - 1)
        this.dismissUnmatched(row)
        return
      }

      row.status = 'failed'
      row.reason = result.reason ?? row.reason
      this.persistUnmatchedRows()
    } catch (error) {
      console.error('Retry failed', error)
      row.status = 'failed'
      this.persistUnmatchedRows()
    }
  }

  openProductPicker(row: UnmatchedRow) {
    if (!this.storeId) {
      return
    }
    this.copyToClipboard(
      (row.systemId || row.internalId || row.manufacturerSku || '').toString()
    )
    const gameLookup = this.buildNameLookup(this.games)
    const setLookup = this.buildNameLookup(this.sets)
    const dialogRef = this.dialog.open(UnmatchedProductDialogComponent, {
      width: '720px',
      data: {
        initialTerm: row.name ?? row.systemId ?? '',
        gameLookup,
        setLookup
      }
    })

    dialogRef.afterClosed().subscribe((product) => {
      if (!product) {
        return
      }
      this.applyManualMatch(row, product)
    })
  }

  private async applyManualMatch(row: UnmatchedRow, product: any) {
    if (row.status === 'resolving') {
      return
    }
    row.status = 'resolving'
    this.persistUnmatchedRows()

    try {
      if (row.importType === 'retail') {
        await this.applyRetailMatch(row, product)
      } else {
        await this.applyEcomMatch(row, product)
      }

      this.matchedRows += 1
      this.updatedRows += 1
      this.skippedRows = Math.max(0, this.skippedRows - 1)
      this.dismissUnmatched(row)
    } catch (error) {
      console.error('Manual match failed', error)
      row.status = 'failed'
      this.persistUnmatchedRows()
    }
  }

  private async resolveRetailRow(row: UnmatchedRow): Promise<ResolveResult> {
    const name = (row.name ?? '').toString()
    const systemId = (row.systemId ?? '').toString()
    const condition = row.condition ?? 'near_mint'

    if (!name && !systemId) {
      return { matched: false, reason: 'missing_name_or_system_id' }
    }

    if (systemId) {
      const data = await this.data.getProductByPOSId(systemId, this.storeId, condition)
      if (data.total === 1) {
        await this.applyRetailMatch(row, data.data[0])
        return { matched: true, updated: true }
      }
      if (data.total > 1) {
        return { matched: false, reason: 'multiple_pos_matches' }
      }
    }

    if (name) {
      const nameData = await this.data.getProduct({
        name: name
      })
      if (nameData.total === 1) {
        await this.applyRetailMatch(row, nameData.data[0])
        return { matched: true, updated: true }
      }

      if (nameData.total === 0) {
        return { matched: false, reason: 'no_match' }
      }

      return { matched: false, reason: 'multiple_name_matches' }
    }

    return { matched: false, reason: 'no_match' }
  }

  private async resolveEcomRow(row: UnmatchedRow): Promise<ResolveResult> {
    const name = (row.name ?? '').toString()
    const condition = row.condition ?? 'near_mint'
    const internalId = (row.internalId ?? '').toString()
    const internalVariantId = (row.internalVariantId ?? '').toString()
    const manufacturerSku = (row.manufacturerSku ?? '').toString()

    if (!name && !manufacturerSku && !internalId) {
      return { matched: false, reason: 'missing_identifiers' }
    }

    if (internalId && internalVariantId) {
      const byIds = await this.data.getProductByEComIDs(this.storeId, condition, internalId, internalVariantId)
      if (byIds.total === 1) {
        return { matched: true, updated: false }
      }
    }

    if (manufacturerSku) {
      const bySystemId = await this.data.getProductByPOSId(manufacturerSku, this.storeId, condition)
      if (bySystemId.total === 1) {
        await this.applyEcomMatch(row, bySystemId.data[0])
        return { matched: true, updated: true }
      }
    }

    if (name) {
      const byName = await this.data.getProduct({
        name: name
      })
      if (byName.total === 1) {
        await this.applyEcomMatch(row, byName.data[0])
        return { matched: true, updated: true }
      }

      if (byName.total === 0) {
        return { matched: false, reason: 'no_match' }
      }

      return { matched: false, reason: 'multiple_name_matches' }
    }

    return { matched: false, reason: 'no_match' }
  }

  private async applyRetailMatch(row: UnmatchedRow, product: any) {
    const condition = row.condition ?? 'near_mint'
    const quantity = Number(row.quantity ?? 0)
    const cost = row.cost ?? null

    let patchBody: Record<string, any> = {
      [`store_status.${this.storeId}.${condition}.selling.enabled`]: true,
      [`store_status.${this.storeId}.${condition}.selling.quantity`]: quantity
    }

    if (row.systemId) {
      patchBody[`store_status.${this.storeId}.${condition}.pos_id`] = row.systemId
    }

    if (cost !== null && cost !== undefined) {
      patchBody[`store_status.${this.storeId}.${condition}.average_cost`] = cost
    }

    await this.data.patchProduct(product._id, patchBody)
  }

  private async applyEcomMatch(row: UnmatchedRow, product: any) {
    const condition = row.condition ?? 'near_mint'
    const internalId = row.internalId ?? ''
    const internalVariantId = row.internalVariantId ?? ''

    if (!internalId || !internalVariantId) {
      throw new Error('Missing ecom identifiers')
    }

    await this.data.patchProduct(product._id, {
      [`store_status.${this.storeId}.${condition}.ecom_pid`]: internalId,
      [`store_status.${this.storeId}.${condition}.ecom_vid`]: internalVariantId
    })
  }

  async processEComCSV(results: any) {
    const products = results.data ?? []
    const batchSize = 10

    await this.processInBatches(products, batchSize, async (product: any, index: number) => {
      let category = product['EN_Category_3']
      if (category !== 'Single Cards') {
        return { skipped: true }
      }

      let name = product['EN_Title_Long']
      let condition = 'near_mint'
      let found = false
      let updated = false
      if (name.endsWith('(LP)')) {
        condition = 'lightly_played'
        name = name.slice(0, -5)
      } else if (name.endsWith('(MP)')) {
        condition = 'moderately_played'
        name = name.slice(0, -5)
      } else if (name.endsWith('(HP)')) {
        condition = 'heavily_played'
        name = name.slice(0, -5)
      } else if (name.endsWith('(DMG)')) {
        condition = 'damaged'
        name = name.slice(0, -6)
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
          updated = true
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
          updated = true
          let foundProduct = byName.data[0]
          await this.data.patchProduct(foundProduct._id, {
            [`store_status.${this.storeId}.${condition}.ecom_pid`]: product['Internal_ID'],
            [`store_status.${this.storeId}.${condition}.ecom_vid`]: product['Internal_Variant_ID']
          })
        }
      }

      if (!found) {
        return {
          skipped: true,
          unmatched: this.createUnmatchedRow('ecom', index, {
            name,
            category,
            condition,
            internalId: product.Internal_ID ?? '',
            internalVariantId: product.Internal_Variant_ID ?? '',
            manufacturerSku: product.manufacturer_sku ?? '',
            reason: 'no_match'
          })
        }
      }

      return { matched: true, updated }
    })

    this.finalizeProcessing(
      `ECom CSV processing complete. Updated ${this.updatedRows}, skipped ${this.skippedRows}, errors ${this.errorRows}.`
    )
  }
  getExchangeRate(price: number) {
    if (price == -1) {
      return -1
    } else {
      return this.currency.convert(price)
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
    const products = results.data ?? []
    const priceChanges: {}[] = []
    const batchSize = 10

    await this.processInBatches(products, batchSize, async (product: any, index: number) => {
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
        name = name.slice(0, -5)
      } else if (name.endsWith('(MP)')) {
        condition = 'moderately_played'
        name = name.slice(0, -5)
      } else if (name.endsWith('(HP)')) {
        condition = 'heavily_played'
        name = name.slice(0, -5)
      } else if (name.endsWith('(DMG)')) {
        condition = 'damaged'
        name = name.slice(0, -6)
      }

      const data = await this.data.getProductByPOSId(systemId, this.storeId, condition)
      if (data.total === 1) {
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

        return { matched: true, updated: true }
      }

      if (data.total === 0) {
        const nameData = await this.data.getProduct({
          name: name
        })
        if (nameData.total === 1) {
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

          return { matched: true, updated: true }
        }

        if (nameData.total === 0) {
          return {
            skipped: true,
            unmatched: this.createUnmatchedRow('retail', index, {
              name,
              systemId,
              condition,
              quantity,
              cost,
              price,
              reason: 'no_match'
            })
          }
        }

        return {
          skipped: true,
          unmatched: this.createUnmatchedRow('retail', index, {
            name,
            systemId,
            condition,
            quantity,
            cost,
            price,
            reason: 'multiple_name_matches'
          })
        }
      }

      return {
        skipped: true,
        unmatched: this.createUnmatchedRow('retail', index, {
          name,
          systemId,
          condition,
          quantity,
          cost,
          price,
          reason: 'multiple_pos_matches'
        })
      }
    })

    const csv = Papa.unparse(priceChanges)
    this.downloadBlob(csv, 'tcg_prices.csv', 'text/csv;charset=utf-8')
    this.finalizeProcessing(
      `Retail CSV processing complete. Updated ${this.updatedRows}, skipped ${this.skippedRows}, errors ${this.errorRows}.`
    )
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
      this.downloadBlob(
        csv,
        this.applyCurrencySuffix('tcg_prices_set.csv'),
        'text/csv;charset=utf-8'
      )
    }
  }

  async exportSellingByGame() {
    const data = await this.data.getSellingForGame(this.selectedGame, this.storeId, this.newOnlyForGame)
    console.log(data)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId, this.newOnlyForGame)
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(
        csv,
        this.applyCurrencySuffix('tcg_prices_game.csv'),
        'text/csv;charset=utf-8'
      )
    }
  }

  async exportSellingByGameWithPosId() {
    const data = await this.data.getSellingForGameWithPosId(this.selectedGame, this.storeId)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId, false, {
        includeZeroQty: true,
        requirePosId: true
      })
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(
        csv,
        this.applyCurrencySuffix('tcg_prices_game_with_pos.csv'),
        'text/csv;charset=utf-8'
      )
    }
  }

  async exportSelling() {
    const data = await this.data.getSelling(this.storeId)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId, false)
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(
        csv,
        this.applyCurrencySuffix('tcg_prices_all.csv'),
        'text/csv;charset=utf-8'
      )
    }
  }

  async exportSellingWithPosId() {
    const data = await this.data.getSellingWithPosId(this.storeId)
    if (data.total !== 0) {
      const jsonArray = await this.processProducts(data.data, this.storeId, false, {
        includeZeroQty: true,
        requirePosId: true
      })
      const csv = Papa.unparse(jsonArray)
      this.downloadBlob(
        csv,
        this.applyCurrencySuffix('tcg_prices_all_with_pos.csv'),
        'text/csv;charset=utf-8'
      )
    }
  }

  async processProducts(
    products: any[],
    storeId: string,
    newOnly: boolean,
    options: ProcessProductsOptions = {}
  ) {
    const includeZeroQty = options.includeZeroQty ?? false
    const requirePosId = options.requirePosId ?? false
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
          object.currency = this.currency.currentCurrency

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
          if (requirePosId && !status?.pos_id) {
            return []
          }
          // Filter out items with pos_id if newOnly is true
          if (newOnly && status?.pos_id) {
            return [] // Skip items with a pos_id if newOnly is enabled
          }
          if (
            status &&
            status.selling.enabled &&
            (includeZeroQty || status.selling.quantity > 0)
          ) {
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
            if (requirePosId && !status?.pos_id) {
              continue
            }
            // Filter out conditions with pos_id if newOnly is true
            if (newOnly && status?.pos_id) {
              continue // Skip this condition if pos_id is present and newOnly is true
            }
            if (
              status &&
              status.selling.enabled &&
              (includeZeroQty || status.selling.quantity > 0)
            ) {
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
      const currency = this.currency.currentCurrency
      const marketPrice = this.currency.convert(product.market_price ?? 0)
      const lowPrice = this.currency.convert(product.low_price ?? 0)
      const midPrice = this.currency.convert(product.mid_price ?? 0)
      const highPrice = this.currency.convert(product.high_price ?? 0)

      return {
        name: product.name ?? '',
        collector_number: product.collector_number ?? '',
        rarity: product.rarity ?? '',
        print: product.print ?? '',
        finish: product.finish ?? '',
        market_price: this.round(marketPrice),
        low_price: this.round(lowPrice),
        mid_price: this.round(midPrice),
        high_price: this.round(highPrice),
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
        store_buying_quantity: nearMint.buying?.quantity ?? 0,
        currency
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
      return this.applyCurrencySuffix(`search_${this.sanitizeFileName(this.currentSearchTerm)}.csv`)
    }

    if (this.selectedSet) {
      const setName = this.sets.find((set) => set._id === this.selectedSet)?.name ?? this.selectedSet
      return this.applyCurrencySuffix(`set_${this.sanitizeFileName(setName)}.csv`)
    }

    if (this.selectedGame) {
      const gameName = this.games.find((game) => game._id === this.selectedGame)?.name ?? this.selectedGame
      return this.applyCurrencySuffix(`game_${this.sanitizeFileName(gameName)}.csv`)
    }

    return this.applyCurrencySuffix(`products_${Date.now()}.csv`)
  }

  private applyCurrencySuffix(filename: string) {
    const suffix = this.currency.currentCurrency.toLowerCase()
    if (filename.endsWith('.csv')) {
      return filename.replace(/\.csv$/i, `_${suffix}.csv`)
    }
    return `${filename}_${suffix}`
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

interface ProcessResult {
  matched?: boolean
  updated?: boolean
  skipped?: boolean
  unmatched?: UnmatchedRow
  error?: boolean
}

interface UnmatchedRow {
  id: string
  importType: 'retail' | 'ecom'
  row: number
  name?: string
  systemId?: string
  condition?: string
  internalId?: string
  internalVariantId?: string
  manufacturerSku?: string
  category?: string
  quantity?: string | number
  cost?: number | null
  price?: number | null
  reason: string
  status: 'unmatched' | 'resolving' | 'failed'
  createdAt: string
  lastUpdatedAt?: string
}

interface ResolveResult {
  matched: boolean
  updated?: boolean
  reason?: string
}

interface ProcessProductsOptions {
  includeZeroQty?: boolean
  requirePosId?: boolean
}
