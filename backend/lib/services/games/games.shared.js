"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesClient = exports.gamesMethods = exports.gamesPath = void 0;
exports.gamesPath = 'games';
exports.gamesMethods = ['find', 'get', 'create', 'patch', 'remove'];
const gamesClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.gamesPath, connection.service(exports.gamesPath), {
        methods: exports.gamesMethods
    });
};
exports.gamesClient = gamesClient;
//# sourceMappingURL=games.shared.js.map