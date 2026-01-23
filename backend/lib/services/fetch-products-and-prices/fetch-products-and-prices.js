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
exports.fetchProductsAndPrices = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const fetch_products_and_prices_class_1 = require("./fetch-products-and-prices.class");
const fetch_products_and_prices_shared_1 = require("./fetch-products-and-prices.shared");
__exportStar(require("./fetch-products-and-prices.class"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const fetchProductsAndPrices = (app) => {
    // Register our service on the Feathers application
    app.use(fetch_products_and_prices_shared_1.fetchProductsAndPricesPath, new fetch_products_and_prices_class_1.FetchProductsAndPricesService((0, fetch_products_and_prices_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: fetch_products_and_prices_shared_1.fetchProductsAndPricesMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(fetch_products_and_prices_shared_1.fetchProductsAndPricesPath).hooks({
        around: {
            all: [(0, authentication_1.authenticate)('jwt')]
        },
        before: {
            all: [],
            find: [],
            get: [],
            create: [],
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
exports.fetchProductsAndPrices = fetchProductsAndPrices;
//# sourceMappingURL=fetch-products-and-prices.js.map