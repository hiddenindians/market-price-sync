"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setsQueryResolver = exports.setsQueryValidator = exports.setsQuerySchema = exports.setsQueryProperties = exports.setsPatchResolver = exports.setsPatchValidator = exports.setsPatchSchema = exports.setsDataResolver = exports.setsDataValidator = exports.setsDataSchema = exports.setsExternalResolver = exports.setsResolver = exports.setsValidator = exports.setsSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const typebox_2 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.setsSchema = typebox_1.Type.Object({
    _id: (0, typebox_2.ObjectIdSchema)(),
    game_id: (0, typebox_2.ObjectIdSchema)(),
    name: typebox_1.Type.String(),
    external_id: typebox_1.Type.Object({
        tcgcsv_id: typebox_1.Type.Optional(typebox_1.Type.Number())
    }),
    code: typebox_1.Type.Optional(typebox_1.Type.String()),
    enabled: typebox_1.Type.Boolean({ default: false }),
    first_run: typebox_1.Type.Boolean(),
    store_status: typebox_1.Type.Array(typebox_1.Type.Object({
        store_id: (0, typebox_2.ObjectIdSchema)(),
        visible: typebox_1.Type.Boolean({ default: false })
    }))
    /* Scryfall/Pokemonio data */
    //parent_set_code: Type.Optional(Type.String()),
    //tcgplayer_id: Type.Optional(Type.String()),
    //search_uri: Type.Optional(Type.String()),
    //set_type: Type.Optional(Type.String()),
    //released_at: Type.Optional(Type.String()), //pokemonio releaseDate
    //card_count: Type.Optional(Type.Number()), //pokemonio printedTotal
    //icon_svg_uri: Type.Optional(Type.String()), //pokemonio images.symbol
    //printed_total: Type.Optional(Type.Number()),
    //logo: Type.Optional(Type.String()),
    //updated_at: Type.Optional(Type.String()),
    //unique to mtg
    //digital: Type.Optional(Type.Boolean()),
    //nonfoil_only: Type.Optional(Type.Boolean()),
    //foil_only: Type.Optional(Type.Boolean()),
    //unique to poke
    //images.logo
    //ptcgo_code: Type.Optional(Type.String()),
}, { $id: 'Sets', additionalProperties: false });
exports.setsValidator = (0, typebox_1.getValidator)(exports.setsSchema, validators_1.dataValidator);
exports.setsResolver = (0, schema_1.resolve)({});
exports.setsExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.setsDataSchema = typebox_1.Type.Pick(exports.setsSchema, ['game_id', 'code', 'name', 'external_id'], {
    $id: 'SetsData'
});
exports.setsDataValidator = (0, typebox_1.getValidator)(exports.setsDataSchema, validators_1.dataValidator);
exports.setsDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.setsPatchSchema = typebox_1.Type.Intersect([
    typebox_1.Type.Partial(typebox_1.Type.Object({
        code: typebox_1.Type.Optional(typebox_1.Type.String())
    }))
], {
    $id: 'SetsPatch'
});
exports.setsPatchValidator = (0, typebox_1.getValidator)(exports.setsPatchSchema, validators_1.dataValidator);
exports.setsPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.setsQueryProperties = typebox_1.Type.Pick(exports.setsSchema, ['_id', 'name', 'enabled', 'game_id', 'external_id']);
exports.setsQuerySchema = typebox_1.Type.Intersect([
    typebox_1.Type.Object({
        _id: (0, typebox_1.queryProperty)((0, typebox_2.ObjectIdSchema)()),
        game_id: (0, typebox_1.queryProperty)((0, typebox_2.ObjectIdSchema)()),
        'external_id.tcgcsv_id': (0, typebox_1.queryProperty)(typebox_1.Type.Number()),
        name: (0, typebox_1.queryProperty)(typebox_1.Type.String()),
        $sort: typebox_1.Type.Optional(typebox_1.Type.Object({
            _id: typebox_1.Type.Optional(typebox_1.Type.Number()),
            'external_id.tcgcsv_id': typebox_1.Type.Optional(typebox_1.Type.Number()),
            name: typebox_1.Type.Optional(typebox_1.Type.Number())
        })),
        $limit: typebox_1.Type.Optional(typebox_1.Type.Number()),
        $skip: typebox_1.Type.Optional(typebox_1.Type.Number())
    }, { additionalProperties: false })
], { additionalProperties: false });
exports.setsQueryValidator = (0, typebox_1.getValidator)(exports.setsQuerySchema, validators_1.queryValidator);
exports.setsQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=sets.schema.js.map