"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.ProductFiltersService = void 0;
const errors_1 = require("@feathersjs/errors");
const mongodb_1 = require("mongodb");
const print_normalizer_1 = require("../../utils/print-normalizer");
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const titleCase = (value) => value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
class ProductFiltersService {
    constructor(options) {
        this.options = options;
    }
    async find(params) {
        const { gameId, setId } = params?.query ?? {};
        if (!gameId || !mongodb_1.ObjectId.isValid(gameId)) {
            throw new errors_1.BadRequest('A valid gameId query parameter is required');
        }
        if (setId && !mongodb_1.ObjectId.isValid(setId)) {
            throw new errors_1.BadRequest('setId must be a valid object id when provided');
        }
        const db = await this.options.app.get('mongodbClient');
        const collection = db.collection('products');
        const matchStage = {
            game_id: new mongodb_1.ObjectId(gameId)
        };
        if (setId) {
            matchStage.set_id = new mongodb_1.ObjectId(setId);
        }
        const [aggregationResult] = await collection
            .aggregate([
            { $match: matchStage },
            {
                $facet: {
                    rarities: [{ $match: { rarity: { $type: 'string' } } }, { $group: { _id: '$rarity' } }],
                    prints: [{ $match: { print: { $type: 'string' } } }, { $group: { _id: '$print' } }],
                    finishes: [{ $match: { finish: { $type: 'string' } } }, { $group: { _id: '$finish' } }],
                    events: [
                        { $unwind: { path: '$event_types', preserveNullAndEmptyArrays: false } },
                        { $match: { event_types: { $type: 'string' } } },
                        { $group: { _id: '$event_types' } }
                    ]
                }
            }
        ])
            .toArray();
        const rawRarities = (aggregationResult?.rarities ?? []).map((entry) => entry?._id);
        const rarities = rawRarities.filter(isNonEmptyString).sort((a, b) => a.localeCompare(b));
        const rawFinishes = (aggregationResult?.finishes ?? []).map((entry) => entry?._id);
        const normalizedFinishKeys = rawFinishes.filter(isNonEmptyString).map((key) => (0, print_normalizer_1.deriveFinishKey)(key));
        const uniqueFinishes = Array.from(new Set(normalizedFinishKeys));
        if (!uniqueFinishes.includes('base')) {
            uniqueFinishes.unshift('base');
        }
        const finishes = uniqueFinishes
            .map((key) => ({ key, label: (0, print_normalizer_1.getPrintLabel)(key) }))
            .sort((a, b) => a.label.localeCompare(b.label));
        const rawPrints = (aggregationResult?.prints ?? []).map((entry) => entry?._id);
        const uniquePrints = Array.from(new Set(rawPrints.filter(isNonEmptyString))).filter((key) => !(0, print_normalizer_1.isFinishKey)(key) || key === 'base');
        if (!uniquePrints.includes('base')) {
            uniquePrints.unshift('base');
        }
        const prints = uniquePrints
            .map((key) => ({ key, label: key === 'base' ? 'Base Variant' : (0, print_normalizer_1.getPrintLabel)(key) }))
            .sort((a, b) => {
            if (a.key === 'base')
                return -1;
            if (b.key === 'base')
                return 1;
            return a.label.localeCompare(b.label);
        });
        const rawEvents = (aggregationResult?.events ?? []).map((entry) => entry?._id);
        const uniqueEvents = Array.from(new Set(rawEvents.filter(isNonEmptyString)));
        const events = uniqueEvents
            .map((key) => ({ key, label: titleCase(key) }))
            .sort((a, b) => a.label.localeCompare(b.label));
        return {
            rarities,
            finishes,
            prints,
            events
        };
    }
}
exports.ProductFiltersService = ProductFiltersService;
const getOptions = (app) => ({ app });
exports.getOptions = getOptions;
//# sourceMappingURL=product-filters.class.js.map