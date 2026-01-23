"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const settings_schema_1 = require("./settings.schema");
const settings_class_1 = require("./settings.class");
const settings_shared_1 = require("./settings.shared");
__exportStar(require("./settings.class"), exports);
__exportStar(require("./settings.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const settings = (app) => {
    // Register our service on the Feathers application
    app.use(settings_shared_1.settingsPath, new settings_class_1.SettingsService((0, settings_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: settings_shared_1.settingsMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(settings_shared_1.settingsPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(settings_schema_1.settingsExternalResolver),
                schema_1.hooks.resolveResult(settings_schema_1.settingsResolver)
            ]
        },
        before: {
            all: [
                schema_1.hooks.validateQuery(settings_schema_1.settingsQueryValidator),
                schema_1.hooks.resolveQuery(settings_schema_1.settingsQueryResolver)
            ],
            find: [],
            get: [],
            create: [
                schema_1.hooks.validateData(settings_schema_1.settingsDataValidator),
                schema_1.hooks.resolveData(settings_schema_1.settingsDataResolver)
            ],
            patch: [
                schema_1.hooks.validateData(settings_schema_1.settingsPatchValidator),
                schema_1.hooks.resolveData(settings_schema_1.settingsPatchResolver)
            ],
            remove: []
        },
        after: {
            all: []
        },
        error: {
            all: []
        }
    });
};
exports.settings = settings;
//# sourceMappingURL=settings.js.map