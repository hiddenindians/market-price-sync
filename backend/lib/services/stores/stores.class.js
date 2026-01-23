"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.StoresService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
class StoresService extends mongodb_1.MongoDBService {
}
exports.StoresService = StoresService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('stores'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=stores.class.js.map