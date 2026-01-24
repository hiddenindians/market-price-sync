"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.ProductsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
class ProductsService extends mongodb_1.MongoDBService {
}
exports.ProductsService = ProductsService;
const getOptions = (app) => {
    return {
        paginate: {
            default: 10,
            max: 500000
        },
        multi: ['create'],
        Model: app
            .get('mongodbClient')
            .then((db) => db.collection('products'))
            .then((collection) => {
            // Unique composite index matching the buildProductKey logic in update-data.ts
            // This prevents duplicates based on external ID + product attributes
            collection.createIndex({
                'external_id.tcgcsv_id': 1,
                collector_number: 1,
                rarity: 1,
                print: 1,
                finish: 1
            }, { unique: true });
            // Supporting indexes for queries
            collection.createIndex({ collector_number: 1 });
            collection.createIndex({ sort_number: 1 });
            collection.createIndex({ 'external_id.tcgcsv_id': 1 });
            collection.createIndex({ name: 1 });
            collection.createIndex({ name: 'text' });
            collection.createIndex({ market_price: 1 });
            collection.createIndex({ game_id: 1, rarity: 1, print: 1, finish: 1 });
            return collection;
        })
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=products.class.js.map