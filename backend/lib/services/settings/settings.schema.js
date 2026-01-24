"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsQueryResolver = exports.settingsQueryValidator = exports.settingsQuerySchema = exports.settingsQueryProperties = exports.settingsPatchResolver = exports.settingsPatchValidator = exports.settingsPatchSchema = exports.settingsDataResolver = exports.settingsDataValidator = exports.settingsDataSchema = exports.settingsExternalResolver = exports.settingsResolver = exports.settingsValidator = exports.settingsSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const typebox_2 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
// Main data model schema
exports.settingsSchema = typebox_1.Type.Object({
    _id: (0, typebox_2.ObjectIdSchema)(),
    limit: typebox_1.Type.Number(),
    skip: typebox_1.Type.Number(),
    buylist_percentage: typebox_1.Type.Number(),
    timeout: typebox_1.Type.Number(),
    tcgcsv_last_updated: typebox_1.Type.Number(),
    store_id: (0, typebox_2.ObjectIdSchema)()
}, { $id: 'Settings', additionalProperties: false });
exports.settingsValidator = (0, typebox_1.getValidator)(exports.settingsSchema, validators_1.dataValidator);
exports.settingsResolver = (0, schema_1.resolve)({});
exports.settingsExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.settingsDataSchema = typebox_1.Type.Pick(exports.settingsSchema, ['limit', 'skip', 'buylist_percentage', 'timeout', 'tcgcsv_last_updated'], {
    $id: 'SettingsData'
});
exports.settingsDataValidator = (0, typebox_1.getValidator)(exports.settingsDataSchema, validators_1.dataValidator);
exports.settingsDataResolver = (0, schema_1.resolve)({});
// Schema for updating existing entries
exports.settingsPatchSchema = typebox_1.Type.Partial(exports.settingsSchema, {
    $id: 'SettingsPatch'
});
exports.settingsPatchValidator = (0, typebox_1.getValidator)(exports.settingsPatchSchema, validators_1.dataValidator);
exports.settingsPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.settingsQueryProperties = typebox_1.Type.Pick(exports.settingsSchema, ['_id']);
exports.settingsQuerySchema = typebox_1.Type.Intersect([
    (0, typebox_1.querySyntax)(exports.settingsQueryProperties),
    // Add additional query properties here
    typebox_1.Type.Object({}, { additionalProperties: false })
], { additionalProperties: false });
exports.settingsQueryValidator = (0, typebox_1.getValidator)(exports.settingsQuerySchema, validators_1.queryValidator);
exports.settingsQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=settings.schema.js.map