import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, distinctUntilChanged, from, map, switchMap } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { FeathersService } from '../api/feathers.service';
import { Router } from '@angular/router';
import { Store } from '../../shared/models/store.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthPayload | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged())

  public isAuthenticated = this.currentUser.pipe(map((auth) => !!auth?.user))

  private refreshTimeout: number | null = null

  constructor(private _feathers: FeathersService, private router: Router) { }

  public logIn(credentials: {email: string, password: string}): Observable<User> {
    let withStrategy = { strategy: 'local', ...credentials}
    return from(this._feathers.authenticate(withStrategy)).pipe(
      map((data: any) => {
        this.setAuth(data);
        return data.user
      }))
  }

 public signUp(userData: {email: string, password: string, username: string, storeName: string}): Observable<User> {
  let newUser = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  }

  return from(this._feathers.service('users').create(newUser)as Promise <User>).pipe(
      switchMap((user: User) => {
        return from(this._feathers.service('stores').create({ name: userData.storeName, admin_id: user._id }) as Promise<Store>).pipe(
          switchMap((store: Store) => {
            return from(
              this._feathers.service('users').patch(user._id, { store_id: store._id })).pipe(
              switchMap(() => this.logIn(newUser)),
              catchError((error)=> {
                throw error;
              })
            );
          })
        );
      })
    );
  }

  logout():void {
    this.purgeAuth();
    void this.router.navigate(["/login"])
  }

  async reauthenticate(): Promise<AuthPayload> {
    try {
      const data = await this._feathers.reauthentictate({
        strategy: 'local',
        accessToken: window.localStorage.getItem('feathers-jwt') || null
      })
      this.setAuth(data)
      return data
    } catch (err: any) {
      this.logout()
      throw err
    }
  }

  public setAuth(auth: AuthPayload): void{
    this.currentUserSubject.next(auth)
    this.scheduleSessionRefresh(auth?.accessToken)
  }

  public purgeAuth(): void{
    this.currentUserSubject.next(null)
    this.clearRefreshTimeout()
  }

  private scheduleSessionRefresh(accessToken?: string) {
    this.clearRefreshTimeout()
    const token = accessToken || window.localStorage.getItem('feathers-jwt') || ''
    const payload = this.decodeJwtPayload(token)
    const exp = payload?.exp
    if (!exp) {
      return
    }
    const refreshAt = exp * 1000 - Date.now() - 60000
    const delay = Math.max(refreshAt, 0)
    this.refreshTimeout = window.setTimeout(() => {
      this.reauthenticate().catch(() => undefined)
    }, delay)
  }

  private clearRefreshTimeout() {
    if (this.refreshTimeout !== null) {
      window.clearTimeout(this.refreshTimeout)
      this.refreshTimeout = null
    }
  }

  private decodeJwtPayload(token: string): { exp?: number } | null {
    if (!token) {
      return null
    }
    const parts = token.split('.')
    if (parts.length < 2) {
      return null
    }
    try {
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Failed to decode JWT', error)
      return null
    }
  }
}

interface AuthPayload {
  accessToken?: string
  user: User
}
