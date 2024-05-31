import { Routes } from '@angular/router';
import { authGuard } from './services/guards/auth.guard';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import AuthComponent from './routes/auth/auth.component';

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
    }
  ];