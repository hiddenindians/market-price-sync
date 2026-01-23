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
exports.sets = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const sets_schema_1 = require("./sets.schema");
const sets_class_1 = require("./sets.class");
const sets_shared_1 = require("./sets.shared");
__exportStar(require("./sets.class"), exports);
__exportStar(require("./sets.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const sets = (app) => {
    // Register our service on the Feathers application
    app.use(sets_shared_1.setsPath, new sets_class_1.SetsService((0, sets_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: sets_shared_1.setsMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(sets_shared_1.setsPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(sets_schema_1.setsExternalResolver),
                schema_1.hooks.resolveResult(sets_schema_1.setsResolver)
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(sets_schema_1.setsQueryValidator), schema_1.hooks.resolveQuery(sets_schema_1.setsQueryResolver)],
            find: [],
            get: [],
            create: [schema_1.hooks.validateData(sets_schema_1.setsDataValidator), schema_1.hooks.resolveData(sets_schema_1.setsDataResolver)],
            patch: [schema_1.hooks.validateData(sets_schema_1.setsPatchValidator), schema_1.hooks.resolveData(sets_schema_1.setsPatchResolver)],
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
exports.sets = sets;
//# sourceMappingURL=sets.js.map