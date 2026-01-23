"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsClient = exports.settingsMethods = exports.settingsPath = void 0;
exports.settingsPath = 'settings';
exports.settingsMethods = ['find', 'get', 'create', 'patch', 'remove'];
const settingsClient = (client) => {
    const connection = client.get('connection');
    client.use(exports.settingsPath, connection.service(exports.settingsPath), {
        methods: exports.settingsMethods
    });
};
exports.settingsClient = settingsClient;
//# sourceMappingURL=settings.shared.js.map