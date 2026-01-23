"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.PricesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
class PricesService extends mongodb_1.MongoDBService {
}
exports.PricesService = PricesService;
const getOptions = (app) => {
    return {
        paginate: app.get('paginate'),
        Model: app.get('mongodbClient').then((db) => db.collection('prices')).then((collection) => {
            collection.createIndex({ product_id: 1 });
            return collection;
        })
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=prices.class.js.map