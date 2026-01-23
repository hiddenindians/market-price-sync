"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsQueryResolver = exports.productsQueryValidator = exports.productsQuerySchema = exports.productsQueryProperties = exports.productsPatchResolver = exports.productsPatchValidator = exports.productsPatchSchema = exports.productsDataResolver = exports.productsDataValidator = exports.productsDataSchema = exports.productsExternalResolver = exports.productsResolver = exports.productsValidator = exports.productsSchema = void 0;
// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
const schema_1 = require("@feathersjs/schema");
const typebox_1 = require("@feathersjs/typebox");
const typebox_2 = require("@feathersjs/typebox");
const validators_1 = require("../../validators");
const conditionSchema = typebox_1.Type.Object({
    selling: typebox_1.Type.Optional(typebox_1.Type.Object({
        enabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        quantity: typebox_1.Type.Optional(typebox_1.Type.Number())
    })),
    buying: typebox_1.Type.Optional(typebox_1.Type.Object({
        enabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        quantity: typebox_1.Type.Optional(typebox_1.Type.Number())
    })),
    average_cost: typebox_1.Type.Optional(typebox_1.Type.Number()),
    pos_id: typebox_1.Type.Optional(typebox_1.Type.String()),
    ecom_pid: typebox_1.Type.Optional(typebox_1.Type.String()),
    ecom_vid: typebox_1.Type.Optional(typebox_1.Type.String())
});
// Main data model schema
exports.productsSchema = typebox_1.Type.Object({
    _id: (0, typebox_2.ObjectIdSchema)(),
    game_id: (0, typebox_2.ObjectIdSchema)(),
    set_id: (0, typebox_2.ObjectIdSchema)(),
    external_id: typebox_1.Type.Object({
        tcgcsv_id: typebox_1.Type.Optional(typebox_1.Type.Number()),
        tcgcsv_category_id: typebox_1.Type.Optional(typebox_1.Type.Number()),
        tcgcsv_group_id: typebox_1.Type.Optional(typebox_1.Type.Number())
    }),
    image_url: typebox_1.Type.Optional(typebox_1.Type.String()),
    // selling: Type.Object({
    //   enabled: Type.Boolean({ default: false }),
    //   quantity: Type.Optional(Type.Number({ default: 0 }))
    // }),
    // selling: Type.Object({}),
    // "selling.enabled": Type.Boolean(),
    // "selling.quantity": Type.Number(),
    // buying: Type.Object({
    //   enabled: Type.Boolean({ default: false }),
    //   quantity: Type.Optional(Type.Number({ default: 0 }))
    // }),
    last_updated: typebox_1.Type.Number(),
    market_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    low_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    mid_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    high_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    direct_low_price: typebox_1.Type.Optional(typebox_1.Type.Number()),
    average_cost: typebox_1.Type.Optional(typebox_1.Type.Number()),
    pos_id: typebox_1.Type.Optional(typebox_1.Type.String()),
    type: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.String(),
    short_name: typebox_1.Type.String(),
    upc: typebox_1.Type.Optional(typebox_1.Type.String()),
    text: typebox_1.Type.Optional(typebox_1.Type.String()),
    rarity: typebox_1.Type.Optional(typebox_1.Type.String()),
    print: typebox_1.Type.Optional(typebox_1.Type.String()),
    finish: typebox_1.Type.Optional(typebox_1.Type.String()),
    collector_number: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Number()])),
    sort_number: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Number()])),
    extended_data: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({
        name: typebox_1.Type.Optional(typebox_1.Type.String()),
        display_name: typebox_1.Type.Optional(typebox_1.Type.String()),
        value: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Number()]))
    }))),
    event_types: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    /* Store Specific Settings */
    store_status: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Object({
        near_mint: typebox_1.Type.Object({
            selling: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            buying: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            pos_id: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_pid: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_vid: typebox_1.Type.Optional(typebox_1.Type.String()),
            average_cost: typebox_1.Type.Optional(typebox_1.Type.Number())
        }),
        lightly_played: typebox_1.Type.Object({
            selling: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            buying: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            pos_id: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_pid: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_vid: typebox_1.Type.Optional(typebox_1.Type.String()),
            average_cost: typebox_1.Type.Optional(typebox_1.Type.Number())
        }),
        moderately_played: typebox_1.Type.Object({
            selling: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            buying: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            pos_id: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_pid: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_vid: typebox_1.Type.Optional(typebox_1.Type.String()),
            average_cost: typebox_1.Type.Optional(typebox_1.Type.Number())
        }),
        heavily_played: typebox_1.Type.Object({
            selling: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            buying: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            pos_id: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_pid: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_vid: typebox_1.Type.Optional(typebox_1.Type.String()),
            average_cost: typebox_1.Type.Optional(typebox_1.Type.Number())
        }),
        damaged: typebox_1.Type.Object({
            selling: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            buying: typebox_1.Type.Object({
                enabled: typebox_1.Type.Boolean({ default: false }),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 }))
            }),
            pos_id: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_pid: typebox_1.Type.Optional(typebox_1.Type.String()),
            ecom_vid: typebox_1.Type.Optional(typebox_1.Type.String()),
            average_cost: typebox_1.Type.Optional(typebox_1.Type.Number())
        })
    })))
}, {
    $id: 'Products',
    additionalProperties: false
});
exports.productsValidator = (0, typebox_1.getValidator)(exports.productsSchema, validators_1.dataValidator);
exports.productsResolver = (0, schema_1.resolve)({});
exports.productsExternalResolver = (0, schema_1.resolve)({});
// Schema for creating new entries
exports.productsDataSchema = typebox_1.Type.Pick(exports.productsSchema, [
    'game_id',
    'last_updated',
    'set_id',
    'external_id',
    'image_url',
    'name',
    'short_name',
    'type',
    'upc',
    'text',
    'rarity',
    'print',
    'finish',
    'event_types',
    'collector_number',
    'sort_number',
    'market_price',
    'low_price',
    'direct_low_price',
    'mid_price',
    'high_price',
    'average_cost',
    // 'buying',
    // 'selling',
    'extended_data'
], {
    $id: 'ProductsData'
});
exports.productsDataValidator = (0, typebox_1.getValidator)(exports.productsDataSchema, validators_1.dataValidator);
exports.productsDataResolver = (0, schema_1.resolve)({});
// Define a common schema for condition types
// Schema for updating existing entries
exports.productsPatchSchema = typebox_1.Type.Intersect([
    // Type.Partial(Type.Object({ 'selling.enabled': Type.Boolean() })),
    //  Type.Partial(Type.Object({ 'buying.enabled': Type.Boolean() })),
    //   Type.Partial(Type.Object({ 'buying.quantity': Type.Number() })),
    //   Type.Partial(Type.Object({ 'selling.quantity': Type.Number() })),
    typebox_1.Type.Partial(typebox_1.Type.Object({ name: typebox_1.Type.String() })),
    typebox_1.Type.Partial(typebox_1.Type.Object({ last_updated: typebox_1.Type.Number() })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        store_status: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Object({
            near_mint: typebox_1.Type.Optional(conditionSchema),
            lightly_played: typebox_1.Type.Optional(conditionSchema),
            moderately_played: typebox_1.Type.Optional(conditionSchema),
            heavily_played: typebox_1.Type.Optional(conditionSchema),
            damaged: typebox_1.Type.Optional(conditionSchema)
        })))
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        market_price: typebox_1.Type.Number()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        low_price: typebox_1.Type.Number()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        high_price: typebox_1.Type.Number()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        mid_price: typebox_1.Type.Number()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        direct_low_price: typebox_1.Type.Number()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        type: typebox_1.Type.String()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        print: typebox_1.Type.String()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        finish: typebox_1.Type.String()
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        collector_number: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Number()]),
        sort_number: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Number()])
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        event_types: typebox_1.Type.Array(typebox_1.Type.String())
    })),
    typebox_1.Type.Partial(typebox_1.Type.Object({
        set_id: (0, typebox_2.ObjectIdSchema)()
    })),
], {
    $id: 'ProductsPatch'
});
exports.productsPatchValidator = (0, typebox_1.getValidator)(exports.productsPatchSchema, validators_1.dataValidator);
exports.productsPatchResolver = (0, schema_1.resolve)({});
// Schema for allowed query properties
exports.productsQueryProperties = typebox_1.Type.Pick(exports.productsSchema, [
    'collector_number',
    '_id',
    'text',
    'game_id',
    'external_id',
    'set_id',
    'name',
    'sort_number',
    'rarity',
    'print',
    'finish',
    'event_types',
    'market_price'
]);
exports.productsQuerySchema = typebox_1.Type.Intersect([
    typebox_1.Type.Object({
        name: typebox_1.Type.Optional(typebox_1.Type.Union([
            (0, typebox_1.queryProperty)(typebox_1.Type.String()), // Allow plain string
            (0, typebox_1.queryProperty)(typebox_1.Type.Object({
                $regex: typebox_1.Type.Optional(typebox_1.Type.String()),
                $options: typebox_1.Type.Optional(typebox_1.Type.String())
            }))
            // Allow regex object
        ])),
        $text: typebox_1.Type.Optional((0, typebox_1.queryProperty)(typebox_1.Type.Object({
            $search: typebox_1.Type.Optional(typebox_1.Type.String())
        }))),
        rarity: (0, typebox_1.queryProperty)(typebox_1.Type.String()),
        print: (0, typebox_1.queryProperty)(typebox_1.Type.String()),
        finish: (0, typebox_1.queryProperty)(typebox_1.Type.String()),
        rarities: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
        prints: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
        finishes: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
        event_types: (0, typebox_1.queryProperty)(typebox_1.Type.Array(typebox_1.Type.String())),
        market_price: (0, typebox_1.queryProperty)(typebox_1.Type.Number()),
        events: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
        excludeEvents: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        onlyEvents: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        excludePromo: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        onlyPromo: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        minPrice: typebox_1.Type.Optional(typebox_1.Type.Number()),
        maxPrice: typebox_1.Type.Optional(typebox_1.Type.Number()),
        store_status: (0, typebox_1.queryProperty)(typebox_1.Type.Any()),
        // 'store_status': Type.Optional(
        //   Type.Record(
        //     Type.String(),
        //     Type.Object({
        //       pos_id: queryProperty(Type.String()),
        //       selling: Type.Optional(
        //         Type.Object({
        //           enabled: queryProperty(Type.Boolean()),
        //           quantity: queryProperty(Type.Number())
        //         })
        //       ),
        //       buying: Type.Optional(
        //         Type.Object({
        //           enabled: queryProperty(Type.Boolean()),
        //           quantity: queryProperty(Type.Number())
        //         })
        //       )
        //     })
        //   )
        // ),
        'external_id.tcgcsv_id': (0, typebox_1.queryProperty)(typebox_1.Type.Number()),
        'external_id.tcgcsv_group_id': (0, typebox_1.queryProperty)(typebox_1.Type.Number()),
        game_id: (0, typebox_1.queryProperty)((0, typebox_2.ObjectIdSchema)()),
        set_id: (0, typebox_1.queryProperty)((0, typebox_2.ObjectIdSchema)()),
        $sort: typebox_1.Type.Optional(typebox_1.Type.Object({
            'external_id.tcgcsv_group_id': typebox_1.Type.Optional(typebox_1.Type.Number()),
            sort_number: typebox_1.Type.Optional(typebox_1.Type.Number()),
            'price.market_price.Normal': typebox_1.Type.Optional(typebox_1.Type.Number()),
            'price.market_price.Foil': typebox_1.Type.Optional(typebox_1.Type.Number())
        })),
        $limit: typebox_1.Type.Optional(typebox_1.Type.Number()),
        $skip: typebox_1.Type.Optional(typebox_1.Type.Number()),
        $or: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({})))
    })
], {
    additionalProperties: true
});
exports.productsQueryValidator = (0, typebox_1.getValidator)(exports.productsQuerySchema, validators_1.queryValidator);
exports.productsQueryResolver = (0, schema_1.resolve)({});
//# sourceMappingURL=products.schema.js.map