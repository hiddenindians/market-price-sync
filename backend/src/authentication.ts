// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { Middleware } from 'koa';

import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)

  // // Middleware to set the token in an HttpOnly cookie
  // const setTokenInCookie: Middleware = async (ctx, next) => {
  //   await next();
  //   if (ctx.result && ctx.result.accessToken) {
  //     ctx.cookies.set('feathers-jwt', ctx.result.accessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production', // Set secure flag in production
  //       sameSite: 'strict',
  //     });
  //   }
  // };

  // app.use(setTokenInCookie);


  
}
