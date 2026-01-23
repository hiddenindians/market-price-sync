"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricesClient = exports.pricesMethods = exports.pricesPath = void 0;
exports.pricesPath = 'prices';
exports.pricesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const pricesClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.pricesPath, connection.service(exports.pricesPath), {
        methods: exports.pricesMethods
    });
};
exports.pricesClient = pricesClient;
//# sourceMappingURL=prices.shared.js.map