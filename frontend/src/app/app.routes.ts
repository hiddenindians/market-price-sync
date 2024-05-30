import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: LoginComponent
      }

];
