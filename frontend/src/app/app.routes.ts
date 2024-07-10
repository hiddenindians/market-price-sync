import { Routes } from '@angular/router';
import { authGuard } from './services/guards/auth.guard';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import AuthComponent from './routes/auth/auth.component';
import { InventoryComponent } from './routes/inventory/inventory.component';
import { ManageTCGProductsComponent } from './routes/manage-tcg-products/manage-tcg-products.component';
import { BuylistComponent } from './routes/buylist/buylist.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    {
      path: 'login',
      component: AuthComponent
    },
    {
      path: 'register',
      component: AuthComponent
    },
    {
      path: 'dashboard',
      component: DashboardComponent, // Replace with your actual component
      canActivate: [authGuard]
    },
    {
      path: 'inventory',
      component: InventoryComponent, 
      canActivate: [authGuard]
    },
    {
      path: 'buylist',
      component: BuylistComponent,
      canActivate: [authGuard]
    },
    {
      path: 'inventory/manage-tcg-products',
      component: ManageTCGProductsComponent,
      canActivate: [authGuard]
    }
  ];