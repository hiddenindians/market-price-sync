import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { environment } from '../../../environments/environment'

type CurrencyCode = 'CAD' | 'USD'

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencyKey = 'currency_preference'
  private rateKey = 'cad_rate_cache'
  private rateUpdatedKey = 'cad_rate_updated_at'
  private rateRefreshMs = 24 * 60 * 60 * 1000
  private refreshTimeout: number | null = null

  private currencySubject = new BehaviorSubject<CurrencyCode>('CAD')
  private cadRateSubject = new BehaviorSubject<number>(1.38)
  private rateUpdatedSubject = new BehaviorSubject<Date | null>(null)

  readonly currency$ = this.currencySubject.asObservable()
  readonly cadRate$ = this.cadRateSubject.asObservable()
  readonly rateUpdated$ = this.rateUpdatedSubject.asObservable()

  constructor() {
    this.loadFromStorage()
    this.refreshRateIfNeeded()
  }

  get currentCurrency() {
    return this.currencySubject.value
  }

  get cadRate() {
    return this.cadRateSubject.value
  }

  setCurrency(currency: CurrencyCode) {
    this.currencySubject.next(currency)
    window.localStorage.setItem(this.currencyKey, currency)
  }

  convert(usdAmount: number): number {
    const numeric = Number(usdAmount)
    if (!Number.isFinite(numeric)) {
      return usdAmount
    }
    if (this.currencySubject.value === 'CAD') {
      return numeric * this.cadRateSubject.value
    }
    return numeric
  }

  async refreshRate() {
    const appId = environment.openExchangeRatesAppId
    if (!appId) {
      return
    }
    try {
      const response = await fetch(
        `https://openexchangerates.org/api/latest.json?app_id=${appId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates')
      }
      const data = await response.json()
      const rate = data?.rates?.CAD
      if (typeof rate === 'number' && Number.isFinite(rate)) {
        this.setCadRate(rate)
      }
    } catch (error) {
      console.error('Exchange rate refresh failed', error)
    }
  }

  private loadFromStorage() {
    const storedCurrency = window.localStorage.getItem(this.currencyKey)
    if (storedCurrency === 'CAD' || storedCurrency === 'USD') {
      this.currencySubject.next(storedCurrency)
    }

    const storedRate = window.localStorage.getItem(this.rateKey)
    const parsedRate = storedRate ? Number(storedRate) : NaN
    if (Number.isFinite(parsedRate)) {
      this.cadRateSubject.next(parsedRate)
    }

    const storedUpdated = window.localStorage.getItem(this.rateUpdatedKey)
    if (storedUpdated) {
      const parsedDate = new Date(Number(storedUpdated))
      if (!Number.isNaN(parsedDate.getTime())) {
        this.rateUpdatedSubject.next(parsedDate)
      }
    }
  }

  private setCadRate(rate: number) {
    this.cadRateSubject.next(rate)
    const updated = new Date()
    this.rateUpdatedSubject.next(updated)
    window.localStorage.setItem(this.rateKey, rate.toString())
    window.localStorage.setItem(this.rateUpdatedKey, updated.getTime().toString())
    this.scheduleRefresh(updated)
  }

  private refreshRateIfNeeded() {
    const updatedAt = this.rateUpdatedSubject.value
    if (!updatedAt) {
      void this.refreshRate()
      return
    }
    this.scheduleRefresh(updatedAt)
    const isStale = Date.now() - updatedAt.getTime() > this.rateRefreshMs
    if (isStale) {
      void this.refreshRate()
    }
  }

  private scheduleRefresh(updatedAt: Date) {
    this.clearRefreshTimeout()
    const nextRefresh = updatedAt.getTime() + this.rateRefreshMs - Date.now()
    const delay = Math.max(nextRefresh, 0)
    this.refreshTimeout = window.setTimeout(() => {
      void this.refreshRate()
    }, delay)
  }

  private clearRefreshTimeout() {
    if (this.refreshTimeout !== null) {
      window.clearTimeout(this.refreshTimeout)
      this.refreshTimeout = null
    }
  }
}
