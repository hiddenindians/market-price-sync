"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGamesClient = exports.fetchGamesMethods = exports.fetchGamesPath = void 0;
exports.fetchGamesPath = 'fetch-games';
exports.fetchGamesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const fetchGamesClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.fetchGamesPath, connection.service(exports.fetchGamesPath), {
        methods: exports.fetchGamesMethods
    });
};
exports.fetchGamesClient = fetchGamesClient;
//# sourceMappingURL=fetch-games.shared.js.map