"use strict";
const session = require('express-session');
const { authenticate } = require('@feathersjs/express');
// This sets `req.authentication` from the information added to the session
const setSessionAuthentication = (req, res, next) => {
    req.authentication = req.session.authentication;
    next();
};
module.exports = function (app) {
    // Initialize Express-session - might have to be configured
    // with a persisten storage adapter (like Redis)
    app.use(session({
        secret: 'session-secret',
        saveUninitialized: false,
        resave: true
    }));
    // An endpoint that you can POST to with `email` and `password` that
    // will then perform a local user authentication
    // e.g <form action="/login" method="post"></form>
    app.post('/login', async (req, res, next) => {
        try {
            const { email, password } = req.body;
            // Run normal local authentication through our service
            const { accessToken } = await app.service('authentication').create({
                strategy: 'local',
                email,
                password
            });
            // Register the JWT authentication information on the session
            req.session.authentication = {
                strategy: 'jwt',
                accessToken
            };
            // Redirect to an authenticated page
            res.redirect('/hello');
        }
        catch (error) {
            next(error);
        }
    });
    // Remove the authentication information from the session to log out
    app.get('logout', (req, res) => {
        delete req.session.authentication;
        res.end('You are now logged out');
    });
    // Renders an authenticated page or an 401 error page
    // Always needs `setSessionAuthentication, authenticate('jwt')` middleware first
    app.get('/hello', setSessionAuthentication, authenticate('jwt'), (req, res) => {
        res.end(`Authenticated page with user ${req.user.email}`);
    });
};
//# sourceMappingURL=index.js.map