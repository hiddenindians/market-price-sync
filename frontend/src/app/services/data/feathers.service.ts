import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';
import {feathers } from '@feathersjs/feathers';
import { rx } from 'feathers-reactive';
import authentication from '@feathersjs/authentication-client';

/**
 * Simple wrapper for feathers
 */
@Injectable({
  providedIn: 'root'
})
export class FeathersService {
  private _feathers: any = feathers();                         
  private _socket: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
     this._socket = io('http://localhost:3030/'); 
     this._feathers.configure(socketio(this._socket));
    
    
    }
    this._feathers
      .configure(authentication({  // add authentication plugin
        storage: isPlatformBrowser(this.platformId) ? window.localStorage : undefined,
        
      }))
      .configure(rx({
        idField: '_id'
      }));
  }

  //expose services
  public service(name: string) {
    return this._feathers.service(name);
  }

  public authenticate(credentials?: any): Promise<any> {
    console.log('Authenticating with credentials:', credentials);
    return this._feathers.authenticate({strategy: 'local', ...credentials})
      .then((response: any) => {
        console.log('Authenticated successfully:', response);
        return response;
      })
      .catch((error: any) => {
        console.error('Error during authentication:', error);
        throw error;
      });

      
  }
  public isAuthenticated(): boolean {
    return !!this._feathers.authentication.authenticated;
  }
  
  

  // expose logout
  public logout() {
    return this._feathers.logout();
  }
}
