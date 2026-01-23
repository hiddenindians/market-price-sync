"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const stores_1 = require("./stores/stores");
const fetch_products_and_prices_1 = require("./fetch-products-and-prices/fetch-products-and-prices");
const fetch_sets_1 = require("./fetch-sets/fetch-sets");
const fetch_games_1 = require("./fetch-games/fetch-games");
const settings_1 = require("./settings/settings");
const prices_1 = require("./prices/prices");
const products_1 = require("./products/products");
const product_filters_1 = require("./product-filters/product-filters");
const sets_1 = require("./sets/sets");
const games_1 = require("./games/games");
const users_1 = require("./users/users");
const services = (app) => {
    app.configure(stores_1.stores);
    app.configure(fetch_products_and_prices_1.fetchProductsAndPrices);
    app.configure(fetch_sets_1.fetchSets);
    app.configure(fetch_games_1.fetchGames);
    app.configure(settings_1.settings);
    app.configure(prices_1.prices);
    app.configure(product_filters_1.productFilters);
    app.configure(products_1.products);
    app.configure(sets_1.sets);
    app.configure(games_1.games);
    app.configure(users_1.user);
    // All services will be registered here
};
exports.services = services;
//# sourceMappingURL=index.js.map