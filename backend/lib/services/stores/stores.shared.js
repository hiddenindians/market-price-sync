"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storesClient = exports.storesMethods = exports.storesPath = void 0;
exports.storesPath = 'stores';
exports.storesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const storesClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.storesPath, connection.service(exports.storesPath), {
        methods: exports.storesMethods
    });
};
exports.storesClient = storesClient;
//# sourceMappingURL=stores.shared.js.map