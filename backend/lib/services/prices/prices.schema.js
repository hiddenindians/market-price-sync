"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricesQueryResolver = exports.pricesQueryValidator = exports.pricesQuerySchema = exports.pricesQueryProperties = exports.pricesPatchResolver = exports.pricesPatchValidator = exports.pricesPatchSchema = exports.pricesDataResolver = exports.pricesDataValidator = exports.pricesDataSchema = exports.pricesExternalResolver = exports.pricesResolver = exports.pricesValidator = exports.pricesSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const typebox_2 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.pricesSchema = typebox_1.Type.Object({
    _id: (0, typebox_2.ObjectIdSchema)(),
    product_id: (0, typebox_2.ObjectIdSchema)(),
    timestamp: typebox_1.Type.Number(),
    market_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    low_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    mid_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    high_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    direct_low_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
}, { $id: 'Prices', additionalProperties: false });
exports.pricesValidator = (0, typebox_1.getValidator)(exports.pricesSchema, validators_1.dataValidator);
exports.pricesResolver = (0, schema_1.resolve)({});
exports.pricesExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.pricesDataSchema = typebox_1.Type.Pick(exports.pricesSchema, ['timestamp', 'market_price', 'product_id', 'low_price', 'mid_price', 'high_price', "direct_low_price"], {
    $id: 'PricesData'
});
exports.pricesDataValidator = (0, typebox_1.getValidator)(exports.pricesDataSchema, validators_1.dataValidator);
exports.pricesDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.pricesPatchSchema = typebox_1.Type.Partial(exports.pricesSchema, {
    $id: 'PricesPatch'
});
exports.pricesPatchValidator = (0, typebox_1.getValidator)(exports.pricesPatchSchema, validators_1.dataValidator);
exports.pricesPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.pricesQueryProperties = typebox_1.Type.Pick(exports.pricesSchema, ['_id', 'timestamp', 'market_price', 'product_id']);
exports.pricesQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.pricesQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.pricesQueryValidator = (0, typebox_1.getValidator)(exports.pricesQuerySchema, validators_1.queryValidator);
exports.pricesQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=prices.schema.js.map