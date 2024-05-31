import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, from, map, shareReplay, tap } from 'rxjs'
import { distinctUntilChanged } from 'rxjs'
import { User } from '../../shared/models/user.model'
import { FeathersService } from '../data/feathers.service'
import { Router } from '@angular/router'
import { JwtService } from '../jwt/jwt.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  private currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged())

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user))
  constructor(
    private http: HttpClient, 
    private feathers: FeathersService, 
    private router: Router,
    private jwtService: JwtService
  ) {}

  login(credentials: { email: string; password: string }): Observable<{ user: User }> {
    console.log(credentials);
    return from(this.feathers.authenticate(credentials)).pipe(
      tap((response: any) => {
        this.setAuth(response.user);
        this.router.navigate(['/'])
      })
    );
  }

  register(credentials: { username: string; email: string; password: string }): Observable<{ user: User }> {
    console.log(credentials);
    return from(this.feathers.authenticate(credentials)).pipe(
      tap((response: any) => {
        this.setAuth(response.user);
        this.router.navigate(['/'])
      })
    );
  }

  logout(): void {
    this.purgeAuth()
    void this.router.navigate(['/'])
  }

  getCurrentUser(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>('/user').pipe(
      tap({
        next: ({ user }) => this.setAuth(user),
        error: () => this.purgeAuth()
      }),
      shareReplay(1)
    )
  }

  update(user: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>('/user', { user }).pipe(
      tap(({ user }) => {
        this.currentUserSubject.next(user)
      })
    )
  }

  setAuth(user: User): void {
    this.jwtService.saveToken(user.accessToken)
    this.currentUserSubject.next(user)
  }

  purgeAuth(): void {
    this.jwtService.destroyToken()
    this.currentUserSubject.next(null)
  }
}
