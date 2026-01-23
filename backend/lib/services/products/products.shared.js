"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsClient = exports.productsMethods = exports.productsPath = void 0;
exports.productsPath = 'products';
exports.productsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const productsClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.productsPath, connection.service(exports.productsPath), {
        methods: exports.productsMethods
    });
};
exports.productsClient = productsClient;
//# sourceMappingURL=products.shared.js.map