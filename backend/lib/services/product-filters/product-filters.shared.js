"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFiltersClient = exports.productFiltersMethods = exports.productFiltersPath = void 0;
exports.productFiltersPath = 'products/filters';
exports.productFiltersMethods = ['find'];
const productFiltersClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.productFiltersPath, connection.service(exports.productFiltersPath), {
        methods: exports.productFiltersMethods
    });
};
exports.productFiltersClient = productFiltersClient;
//# sourceMappingURL=product-filters.shared.js.map