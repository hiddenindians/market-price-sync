"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesQueryResolver = exports.gamesQueryValidator = exports.gamesQuerySchema = exports.gamesPatchResolver = exports.gamesPatchValidator = exports.gamesPatchSchema = exports.gamesDataResolver = exports.gamesDataValidator = exports.gamesDataSchema = exports.gamesExternalResolver = exports.gamesResolver = exports.gamesValidator = exports.gamesSchema = void 0;
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const typebox_2 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.gamesSchema = typebox_1.Type.Object({
    _id: (0, typebox_2.ObjectIdSchema)(),
    name: typebox_1.Type.String(),
    logo: typebox_1.Type.Optional(typebox_1.Type.String()),
    external_id: typebox_1.Type.Object({
        tcgcsv_id: typebox_1.Type.Optional(typebox_1.Type.Number())
    }),
    enabled: typebox_1.Type.Boolean({ default: false })
}, { $id: 'Games', additionalProperties: false });
exports.gamesValidator = (0, typebox_1.getValidator)(exports.gamesSchema, validators_1.dataValidator);
exports.gamesResolver = (0, schema_1.resolve)({});
exports.gamesExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.gamesDataSchema = typebox_1.Type.Pick(exports.gamesSchema, ['name', 'external_id', 'logo'], {
    $id: 'GamesData'
});
exports.gamesDataValidator = (0, typebox_1.getValidator)(exports.gamesDataSchema, validators_1.dataValidator);
exports.gamesDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.gamesPatchSchema = typebox_1.Type.Partial(exports.gamesSchema, {
    $id: 'GamesPatch'
});
exports.gamesPatchValidator = (0, typebox_1.getValidator)(exports.gamesPatchSchema, validators_1.dataValidator);
exports.gamesPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.gamesQuerySchema = typebox_1.Type.Object({
    _id: (0, typebox_1.queryProperty)((0, typebox_2.ObjectIdSchema)()),
    'external_id.tcgcsv_id': (0, typebox_1.queryProperty)(typebox_1.Type.Number()),
    enabled: (0, typebox_1.queryProperty)(typebox_1.Type.Boolean()),
    $sort: typebox_1.Type.Optional(typebox_1.Type.Object({
        _id: typebox_1.Type.Optional(typebox_1.Type.Number()),
        'external_id.tcgcsv_id': typebox_1.Type.Optional(typebox_1.Type.Number()),
        name: typebox_1.Type.Optional(typebox_1.Type.Number())
    })),
    $limit: typebox_1.Type.Optional(typebox_1.Type.Number()),
    $skip: typebox_1.Type.Optional(typebox_1.Type.Number())
}, { additionalProperties: false });
exports.gamesQueryValidator = (0, typebox_1.getValidator)(exports.gamesQuerySchema, validators_1.queryValidator);
exports.gamesQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=games.schema.js.map