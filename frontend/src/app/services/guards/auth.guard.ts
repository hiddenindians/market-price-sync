import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
    const router = inject(Router)

    console.log(authService.isAuthenticated.pipe(take(1)))
    return authService.isAuthenticated.pipe(take(1))
  
 
 

};
