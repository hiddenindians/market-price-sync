import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { authGuard } from './shared/guards/auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: LoginComponent
      },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }

];

