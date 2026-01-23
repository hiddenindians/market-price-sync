"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.games = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const games_schema_1 = require("./games.schema");
const games_class_1 = require("./games.class");
const games_shared_1 = require("./games.shared");
__exportStar(require("./games.class"), exports);
__exportStar(require("./games.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const games = (app) => {
    // Register our service on the Feathers application
    app.use(games_shared_1.gamesPath, new games_class_1.GamesService((0, games_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: games_shared_1.gamesMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(games_shared_1.gamesPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(games_schema_1.gamesExternalResolver),
                schema_1.hooks.resolveResult(games_schema_1.gamesResolver)
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(games_schema_1.gamesQueryValidator), schema_1.hooks.resolveQuery(games_schema_1.gamesQueryResolver)],
            find: [],
            get: [],
            create: [schema_1.hooks.validateData(games_schema_1.gamesDataValidator), schema_1.hooks.resolveData(games_schema_1.gamesDataResolver)],
            patch: [schema_1.hooks.validateData(games_schema_1.gamesPatchValidator), schema_1.hooks.resolveData(games_schema_1.gamesPatchResolver)],
            remove: []
        },
        after: {
            all: []
        },
        error: {
            all: []
        }
    });
};
exports.games = games;
//# sourceMappingURL=games.js.map