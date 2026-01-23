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
exports.fetchGames = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const fetch_games_class_1 = require("./fetch-games.class");
const fetch_games_shared_1 = require("./fetch-games.shared");
__exportStar(require("./fetch-games.class"), exports);
const update_data_1 = require("../../hooks/update-data");
// A configure function that registers the service and its hooks via `app.configure`
const fetchGames = (app) => {
    // Register our service on the Feathers application
    app.use(fetch_games_shared_1.fetchGamesPath, new fetch_games_class_1.FetchGamesService((0, fetch_games_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: fetch_games_shared_1.fetchGamesMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(fetch_games_shared_1.fetchGamesPath).hooks({
        around: {
            all: [(0, authentication_1.authenticate)('jwt')]
        },
        before: {
            all: [],
            find: [],
            get: [],
            create: [
                update_data_1.combinedHook
            ],
            patch: [],
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
exports.fetchGames = fetchGames;
//# sourceMappingURL=fetch-games.js.map