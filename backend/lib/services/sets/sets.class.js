"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.SetsService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
class SetsService extends mongodb_1.MongoDBService {
}
exports.SetsService = SetsService;
const getOptions = (app) => {
    return {
        paginate: {
            default: 10,
            max: 500000
        },
        multi: ['create'],
        Model: app.get('mongodbClient').then((db) => db.collection('sets')).then((collection) => {
            collection.createIndex({ 'external_id.tcgcsv_id': 1 }, { unique: true });
            return collection;
        })
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=sets.class.js.map