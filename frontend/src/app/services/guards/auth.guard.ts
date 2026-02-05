import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../auth/auth.service'
import { inject } from '@angular/core'
import { catchError, from, map, of, switchMap, take } from 'rxjs'

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
  const router = inject(Router)

  return authService.currentUser.pipe(
    take(1),
    switchMap((auth) => {
      if (auth?.user) {
        return of(true)
      }
      const token = window.localStorage.getItem('feathers-jwt')
      if (!token) {
        void router.navigate(['/login'])
        return of(false)
      }
      return from(authService.reauthenticate()).pipe(
        map(() => true),
        catchError(() => {
          void router.navigate(['/login'])
          return of(false)
        })
      )
    })
  )
}
