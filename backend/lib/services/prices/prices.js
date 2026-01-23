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
exports.prices = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const prices_schema_1 = require("./prices.schema");
const prices_class_1 = require("./prices.class");
const prices_shared_1 = require("./prices.shared");
__exportStar(require("./prices.class"), exports);
__exportStar(require("./prices.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const prices = (app) => {
    // Register our service on the Feathers application
    app.use(prices_shared_1.pricesPath, new prices_class_1.PricesService((0, prices_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: prices_shared_1.pricesMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(prices_shared_1.pricesPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(prices_schema_1.pricesExternalResolver),
                schema_1.hooks.resolveResult(prices_schema_1.pricesResolver)
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(prices_schema_1.pricesQueryValidator), schema_1.hooks.resolveQuery(prices_schema_1.pricesQueryResolver)],
            find: [],
            get: [],
            create: [schema_1.hooks.validateData(prices_schema_1.pricesDataValidator), schema_1.hooks.resolveData(prices_schema_1.pricesDataResolver)],
            patch: [schema_1.hooks.validateData(prices_schema_1.pricesPatchValidator), schema_1.hooks.resolveData(prices_schema_1.pricesPatchResolver)],
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
exports.prices = prices;
//# sourceMappingURL=prices.js.map