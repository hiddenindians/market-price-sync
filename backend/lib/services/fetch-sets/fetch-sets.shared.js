"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSetsClient = exports.fetchSetsMethods = exports.fetchSetsPath = void 0;
exports.fetchSetsPath = 'fetch-sets';
exports.fetchSetsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const fetchSetsClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.fetchSetsPath, connection.service(exports.fetchSetsPath), {
        methods: exports.fetchSetsMethods
    });
};
exports.fetchSetsClient = fetchSetsClient;
//# sourceMappingURL=fetch-sets.shared.js.map