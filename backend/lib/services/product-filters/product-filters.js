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
exports.productFilters = void 0;
const authentication_1 = require("@feathersjs/authentication");
const product_filters_class_1 = require("./product-filters.class");
const product_filters_shared_1 = require("./product-filters.shared");
__exportStar(require("./product-filters.class"), exports);
const productFilters = (app) => {
    app.use(product_filters_shared_1.productFiltersPath, new product_filters_class_1.ProductFiltersService((0, product_filters_class_1.getOptions)(app)), {
        methods: product_filters_shared_1.productFiltersMethods,
        events: []
    });
    app.service(product_filters_shared_1.productFiltersPath).hooks({
        around: {
            all: [(0, authentication_1.authenticate)('jwt')]
        },
        before: {
            find: []
        },
        after: {
            find: []
        },
        error: {
            find: []
        }
    });
};
exports.productFilters = productFilters;
//# sourceMappingURL=product-filters.js.map