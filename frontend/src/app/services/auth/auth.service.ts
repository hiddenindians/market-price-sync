import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, delay, distinctUntilChanged, from, map, switchMap } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { FeathersService } from '../api/feathers.service';
import { Router } from '@angular/router';
import { Store } from '../../shared/models/store.model';

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

 public signUp(userData: {email: string, password: string, username: string, storeName: string}): Observable<User> {
  let newUser = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  }

  return from(this._feathers.service('users').create(newUser)as Promise <User>).pipe(
      switchMap((user: User) => {
        this.logIn(newUser)
        return from(this._feathers.service('stores').create({ name: userData.storeName, admin_id: user._id }) as Promise<Store>).pipe(
          switchMap((store: Store) => {
            return from(
              this._feathers.service('users').patch(user._id, { store_id: store._id })).pipe(
              map(() => {
                this.setAuth(user);
                return user;
              }),
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

  reauthenticate():void{
      this._feathers.reauthentictate({
        strategy: 'local',
        accessToken: window.localStorage.getItem('feathers-jwt') || null
      }).then(
        (data: User) => {this.setAuth(data)
        }
      ).catch((err: any) => {
        this.logout()
      })
    
  }

  public setAuth(user: User): void{
    this.currentUserSubject.next(user)
  }

  public purgeAuth(): void{
    this.currentUserSubject.next(null)
  }
}
