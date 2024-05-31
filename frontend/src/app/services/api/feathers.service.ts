import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {feathers} from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import { rx } from 'feathers-reactive';

@Injectable({
  providedIn: 'root',
})
export class FeathersService {
  private _feathers: any;

  constructor() {
    const socket = io('http://localhost:3030'); // Replace with your FeathersJS server URL
    this._feathers = feathers();
    this._feathers.configure(socketio(socket));
    this._feathers.configure(authentication({ storage: window.localStorage }));
    this._feathers.configure(rx({
      idField: 'id'
    }))
  }

  public service(serviceName: string) {
    return this._feathers.service(serviceName);
  }

  public authenticate(credentials: { strategy: string, email: string, password: string }) {
    return this._feathers.authenticate(credentials);
  }

  public reauthentictate(credentials?: {strategy: string, accessToken: string | null}){
    return this._feathers.reAuthenticate(credentials);
  }

  public logout() {
    return this._feathers.logout();
  }
}
