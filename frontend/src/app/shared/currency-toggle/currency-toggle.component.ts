import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { CurrencyService } from '../../services/currency/currency.service'

@Component({
    selector: 'app-currency-toggle',
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, DatePipe],
    templateUrl: './currency-toggle.component.html',
    styleUrl: './currency-toggle.component.scss'
})
export class CurrencyToggleComponent {
  currency$ = this.currency.currency$
  cadRate$ = this.currency.cadRate$
  rateUpdated$ = this.currency.rateUpdated$

  constructor(private currency: CurrencyService) {}

  setCurrency(value: 'CAD' | 'USD') {
    this.currency.setCurrency(value)
  }
}
