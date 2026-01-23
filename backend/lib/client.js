"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
const feathers_1 = require("@feathersjs/feathers");
const authentication_client_1 = __importDefault(require("@feathersjs/authentication-client"));
const stores_shared_1 = require("./services/stores/stores.shared");
const fetch_products_and_prices_shared_1 = require("./services/fetch-products-and-prices/fetch-products-and-prices.shared");
const fetch_sets_shared_1 = require("./services/fetch-sets/fetch-sets.shared");
const fetch_games_shared_1 = require("./services/fetch-games/fetch-games.shared");
const settings_shared_1 = require("./services/settings/settings.shared");
const prices_shared_1 = require("./services/prices/prices.shared");
const products_shared_1 = require("./services/products/products.shared");
const product_filters_shared_1 = require("./services/product-filters/product-filters.shared");
const sets_shared_1 = require("./services/sets/sets.shared");
const games_shared_1 = require("./services/games/games.shared");
const users_shared_1 = require("./services/users/users.shared");
/**
 * Returns a typed client for the mps app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
const createClient = (connection, authenticationOptions = {}) => {
    const client = (0, feathers_1.feathers)();
    client.configure(connection);
    client.configure((0, authentication_client_1.default)(authenticationOptions));
    client.set('connection', connection);
    client.configure(users_shared_1.userClient);
    client.configure(games_shared_1.gamesClient);
    client.configure(sets_shared_1.setsClient);
    client.configure(products_shared_1.productsClient);
    client.configure(product_filters_shared_1.productFiltersClient);
    client.configure(prices_shared_1.pricesClient);
    client.configure(settings_shared_1.settingsClient);
    client.configure(fetch_games_shared_1.fetchGamesClient);
    client.configure(fetch_sets_shared_1.fetchSetsClient);
    client.configure(fetch_products_and_prices_shared_1.fetchProductsAndPricesClient);
    client.configure(stores_shared_1.storesClient);
    return client;
};
exports.createClient = createClient;
//# sourceMappingURL=client.js.map