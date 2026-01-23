"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
const authentication_1 = require("@feathersjs/authentication");
const authentication_local_1 = require("@feathersjs/authentication-local");
const authentication = (app) => {
    const authentication = new authentication_1.AuthenticationService(app);
    authentication.register('jwt', new authentication_1.JWTStrategy());
    authentication.register('local', new authentication_local_1.LocalStrategy());
    app.use('authentication', authentication);
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
};
exports.authentication = authentication;
//# sourceMappingURL=authentication.js.map