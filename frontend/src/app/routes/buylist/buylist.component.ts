import { Component, inject } from '@angular/core'
import { AuthService } from '../../services/auth/auth.service'
import { DataService } from '../../services/data/data.service'
import { MatCardModule } from '@angular/material/card'

@Component({
  selector: 'app-buylist',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './buylist.component.html',
  styleUrl: './buylist.component.scss'
})
export class BuylistComponent {
  _auth = inject(AuthService)
  _data = inject(DataService)
  userSubscription$: any
  storeId: string = ''
  products: any = []
  cart: any[] = []
  total: number = 0

  ngOnInit() {
    this.userSubscription$ = this._auth.currentUser.subscribe((user: any) => {
      this.storeId = user.user.store_id
      this.fetchProducts()
    })
  }

  fetchProducts() {
    this._data.getProduct({
      [`store_status.${this.storeId}.buying.enabled`]: true 
    }).then((data:any) => {
      console.log(data.data)
      this.products = data.data
    })
  }

  addToCart(product: any) {
    const existingProduct = this.cart.find(item => item._id === product._id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.buylist_price * item.quantity, 0);
  }

  submitOrder() {
    const order = {
      storeId: this.storeId,
      products: this.cart,
      total: this.total,
      date: new Date()
    };
    // this._data.createOrder(order).then(() => {
    //   this.cart = [];
    //   this.total = 0;
    //   alert('Order placed successfully!');
    // });
  }
  ngOnDestroy() {
    this.userSubscription$.unsubscribe()
  }
}
