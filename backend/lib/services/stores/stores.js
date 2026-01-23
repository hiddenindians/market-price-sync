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
exports.stores = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const schema_1 = require("@feathersjs/schema");
const stores_schema_1 = require("./stores.schema");
const stores_class_1 = require("./stores.class");
const stores_shared_1 = require("./stores.shared");
__exportStar(require("./stores.class"), exports);
__exportStar(require("./stores.schema"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const stores = (app) => {
    // Register our service on the Feathers application
    app.use(stores_shared_1.storesPath, new stores_class_1.StoresService((0, stores_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: stores_shared_1.storesMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(stores_shared_1.storesPath).hooks({
        around: {
            all: [
                (0, authentication_1.authenticate)('jwt'),
                schema_1.hooks.resolveExternal(stores_schema_1.storesExternalResolver),
                schema_1.hooks.resolveResult(stores_schema_1.storesResolver)
            ]
        },
        before: {
            all: [schema_1.hooks.validateQuery(stores_schema_1.storesQueryValidator), schema_1.hooks.resolveQuery(stores_schema_1.storesQueryResolver)],
            find: [],
            get: [],
            create: [schema_1.hooks.validateData(stores_schema_1.storesDataValidator), schema_1.hooks.resolveData(stores_schema_1.storesDataResolver)],
            patch: [schema_1.hooks.validateData(stores_schema_1.storesPatchValidator), schema_1.hooks.resolveData(stores_schema_1.storesPatchResolver)],
            remove: []
        },
        after: {
            all: [],
            create: []
        },
        error: {
            all: []
        }
    });
};
exports.stores = stores;
//# sourceMappingURL=stores.js.map