"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storesQueryResolver = exports.storesQueryValidator = exports.storesQuerySchema = exports.storesQueryProperties = exports.storesPatchResolver = exports.storesPatchValidator = exports.storesPatchSchema = exports.storesDataResolver = exports.storesDataValidator = exports.storesDataSchema = exports.storesExternalResolver = exports.storesResolver = exports.storesValidator = exports.storesSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const typebox_2 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.storesSchema = typebox_1.Type.Object({
    _id: (0, typebox_2.ObjectIdSchema)(),
    name: typebox_1.Type.String(),
    enabled_sets: typebox_1.Type.Array(typebox_1.Type.Any()),
    enabled_games: typebox_1.Type.Array(typebox_1.Type.Any()),
    enabled_oems: typebox_1.Type.Array(typebox_1.Type.Any()),
    enabled_consoles: typebox_1.Type.Array(typebox_1.Type.Any()),
    allow_buying: typebox_1.Type.Boolean(),
    allow_selling: typebox_1.Type.Boolean(),
    admin_id: (0, typebox_2.ObjectIdSchema)()
}, { $id: 'Stores', additionalProperties: false });
exports.storesValidator = (0, typebox_1.getValidator)(exports.storesSchema, validators_1.dataValidator);
exports.storesResolver = (0, schema_1.resolve)({});
exports.storesExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.storesDataSchema = typebox_1.Type.Pick(exports.storesSchema, ['name', 'admin_id'], {
    $id: 'StoresData'
});
exports.storesDataValidator = (0, typebox_1.getValidator)(exports.storesDataSchema, validators_1.dataValidator);
exports.storesDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.storesPatchSchema = typebox_1.Type.Partial(exports.storesSchema, {
    $id: 'StoresPatch'
});
exports.storesPatchValidator = (0, typebox_1.getValidator)(exports.storesPatchSchema, validators_1.dataValidator);
exports.storesPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.storesQueryProperties = typebox_1.Type.Pick(exports.storesSchema, ['_id', 'name']);
exports.storesQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.storesQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.storesQueryValidator = (0, typebox_1.getValidator)(exports.storesQuerySchema, validators_1.queryValidator);
exports.storesQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=stores.schema.js.map