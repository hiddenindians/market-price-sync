"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProductsAndPricesClient = exports.fetchProductsAndPricesMethods = exports.fetchProductsAndPricesPath = void 0;
exports.fetchProductsAndPricesPath = 'fetch-products-and-prices';
exports.fetchProductsAndPricesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const fetchProductsAndPricesClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.fetchProductsAndPricesPath, connection.service(exports.fetchProductsAndPricesPath), {
        methods: exports.fetchProductsAndPricesMethods
    });
};
exports.fetchProductsAndPricesClient = fetchProductsAndPricesClient;
//# sourceMappingURL=fetch-products-and-prices.shared.js.map