"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setsClient = exports.setsMethods = exports.setsPath = void 0;
exports.setsPath = 'sets';
exports.setsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const setsClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.setsPath, connection.service(exports.setsPath), {
        methods: exports.setsMethods
    });
};
exports.setsClient = setsClient;
//# sourceMappingURL=sets.shared.js.map