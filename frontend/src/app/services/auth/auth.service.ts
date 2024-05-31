import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, from, map } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { FeathersService } from '../api/feathers.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>({} as User);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged())

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user))

  constructor(private _feathers: FeathersService, private router: Router) { }

  public logIn(credentials: {email: string, password: string}): Observable<User> {
    let withStrategy = { strategy: 'local', ...credentials}
    return from(this._feathers.authenticate(withStrategy)).pipe(
      map((data: any) => {
        this.setAuth({
          token: data.accessToken,
          ...data.user
        });
        return data.user
      }))
  }

  logout():void {
    this.purgeAuth();
    void this.router.navigate(["/login"])
  }

  reauthenticate():void{
    console.log('populating')
      this._feathers.reauthentictate({
        strategy: 'local',
        accessToken: window.localStorage.getItem('feathers-jwt') || null
      }).then(
        (data: User) => {this.setAuth(data)
          console.log(data)
        }
      ).catch((err: any) => {
        this.logout()
        console.log('erre')
      })
    
  }

  public setAuth(user: User): void{
    this.currentUserSubject.next(user)
  }

  public purgeAuth(): void{
    this.currentUserSubject.next(null)
  }
}
