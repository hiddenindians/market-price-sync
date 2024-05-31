import { CanActivateFn } from '@angular/router'
import { FeathersService } from '../../services/data/feathers.service'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth/auth.service'
import { UserService } from '../../services/user/user.service'

export const authGuard: CanActivateFn = (route, state) => {
  const feathers = inject(UserService)
  const router = inject(Router)

  if (feathers.isAuthenticated) {
    return true
  } else {
    router.navigate(['/login'])
    return true
  }
}
