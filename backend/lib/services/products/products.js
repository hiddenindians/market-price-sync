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
exports.products = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const products_schema_1 = require("./products.schema");
const products_class_1 = require("./products.class");
const products_shared_1 = require("./products.shared");
const filter_store_status_1 = require("../../hooks/filter-store-status");
const return_only_id_1 = require("../../hooks/return-only-id");
const apply_product_filters_1 = require("../../hooks/apply-product-filters");
__exportStar(require("./products.class"), exports);
__exportStar(require("./products.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const products = (app) => {
    // Register our service on the Feathers application
    app.use(products_shared_1.productsPath, new products_class_1.ProductsService((0, products_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: products_shared_1.productsMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(products_shared_1.productsPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(products_schema_1.productsExternalResolver),
                schema_1.hooks.resolveResult(products_schema_1.productsResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(products_schema_1.productsQueryValidator),
                schema_1.hooks.resolveQuery(products_schema_1.productsQueryResolver)
            ],
            find: [apply_product_filters_1.applyProductFilters],
            get: [],
            create: [
                schema_1.hooks.validateData(products_schema_1.productsDataValidator),
                schema_1.hooks.resolveData(products_schema_1.productsDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(products_schema_1.productsPatchValidator),
                schema_1.hooks.resolveData(products_schema_1.productsPatchResolver)
            ],
            remove: []
        },
        after: {
            all: [],
            create: [return_only_id_1.returnOnlyId],
            find: [filter_store_status_1.filterStoreStatus]
        },
        error: {
            all: []
        }
    });
};
exports.products = products;
//# sourceMappingURL=products.js.map