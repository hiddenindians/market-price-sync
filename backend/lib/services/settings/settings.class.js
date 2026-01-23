"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.SettingsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
class SettingsService extends mongodb_1.MongoDBService {
}
exports.SettingsService = SettingsService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('settings'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=settings.class.js.map