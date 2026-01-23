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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSets = void 0;
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
const authentication_1 = require("@feathersjs/authentication");
const fetch_sets_class_1 = require("./fetch-sets.class");
const fetch_sets_shared_1 = require("./fetch-sets.shared");
const axios_1 = __importDefault(require("axios")); // Corrected import statement
__exportStar(require("./fetch-sets.class"), exports);
// A configure function that registers the service and its hooks via `app.configure`
const fetchSets = (app) => {
    // Register our service on the Feathers application
    app.use(fetch_sets_shared_1.fetchSetsPath, new fetch_sets_class_1.FetchSetsService((0, fetch_sets_class_1.getOptions)(app)), {
        // A list of all methods this service exposes externally
        methods: fetch_sets_shared_1.fetchSetsMethods,
        // You can add additional custom events to be sent to clients here
        events: []
    });
    // Initialize hooks
    app.service(fetch_sets_shared_1.fetchSetsPath).hooks({
        around: {
            all: [(0, authentication_1.authenticate)('jwt')]
        },
        before: {
            all: [],
            find: [],
            get: [],
            create: [async () => {
                    let startTime = Date.now();
                    try {
                        const data = await app.service('games').find({ query: { $limit: 100000 } });
                        if (data.total != 0) {
                            const results = data.data;
                            // Fetch groups for all games in parallel
                            const groupPromises = results.map(async (result) => {
                                const externalId = result.external_id.tcgcsv_id;
                                try {
                                    const response = await axios_1.default.get(`https://tcgcsv.com/${externalId}/groups`);
                                    return { result, groups: response.data.results };
                                }
                                catch (groupError) {
                                    console.error(`Error fetching groups for externalId ${externalId}:`, groupError);
                                    return { result, groups: [] };
                                }
                            });
                            const groupsData = await Promise.all(groupPromises);
                            // Process sets for all games in parallel
                            const setPromises = groupsData.flatMap(({ result, groups }) => {
                                return groups.map(async (group) => {
                                    try {
                                        const setData = await app.service('sets').find({
                                            query: {
                                                game_id: result._id,
                                                name: group.name,
                                            }
                                        });
                                        if (setData.total == 0) {
                                            await app.service('sets').create({
                                                game_id: result._id,
                                                name: group.name,
                                                external_id: {
                                                    tcgcsv_id: group.groupId
                                                }
                                            });
                                        }
                                    }
                                    catch (setError) {
                                        console.error(`Error processing set for game_id ${result._id} and name ${group.name}:`);
                                    }
                                });
                            });
                            await Promise.all(setPromises);
                        }
                    }
                    catch (gameError) {
                        console.error('Error fetching games:', gameError);
                    }
                    console.log(`Done. It took ${(Date.now() - startTime) / 1000} seconds`);
                }
            ],
            patch: [],
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
exports.fetchSets = fetchSets;
//# sourceMappingURL=fetch-sets.js.map