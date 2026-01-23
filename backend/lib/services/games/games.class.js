"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.GamesService = void 0;
const mongodb_1 = require("@feathersjs/mongodb");
// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
class GamesService extends mongodb_1.MongoDBService {
}
exports.GamesService = GamesService;
const getOptions = (app) => {
    return {
        paginate: {
            default: 10,
            max: 500000
        },
        multi: ['create'],
        Model: app.get('mongodbClient').then((db) => db.collection('games'))
    };
};
exports.getOptions = getOptions;
//# sourceMappingURL=games.class.js.map