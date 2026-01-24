// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, queryProperty, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ProductsService } from './products.class'

const conditionSchema = Type.Object({
  selling: Type.Optional(
    Type.Object({
      enabled: Type.Optional(Type.Boolean()),
      quantity: Type.Optional(Type.Number())
    })
  ),
  buying: Type.Optional(
    Type.Object({
      enabled: Type.Optional(Type.Boolean()),
      quantity: Type.Optional(Type.Number())
    })
  ),
  average_cost: Type.Optional(Type.Number()),
  pos_id: Type.Optional(Type.String()),
  ecom_pid: Type.Optional(Type.String()),
  ecom_vid: Type.Optional(Type.String())
})

// Main data model schema
export const productsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    game_id: ObjectIdSchema(),
    set_id: ObjectIdSchema(),

    external_id: Type.Object({
      tcgcsv_id: Type.Optional(Type.Number()),
      tcgcsv_category_id: Type.Optional(Type.Number()),
      tcgcsv_group_id: Type.Optional(Type.Number())
    }),
    image_url: Type.Optional(Type.String()),
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
    last_updated: Type.Number(),
    market_price: Type.Optional(Type.Number()),
    low_price: Type.Optional(Type.Number()),
    mid_price: Type.Optional(Type.Number()),
    high_price: Type.Optional(Type.Number()),
    direct_low_price: Type.Optional(Type.Number()),

    average_cost: Type.Optional(Type.Number()),
    pos_id: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    name: Type.String(),
    short_name: Type.String(),

    upc: Type.Optional(Type.String()),
    text: Type.Optional(Type.String()),
    rarity: Type.Optional(Type.String()),
    print: Type.Optional(Type.String()),
    finish: Type.Optional(Type.String()),
    collector_number: Type.Optional(Type.Union([Type.String(), Type.Number()])),
    sort_number: Type.Optional(Type.Union([Type.String(), Type.Number()])),
    extended_data: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.Optional(Type.String()),
          display_name: Type.Optional(Type.String()),
          value: Type.Optional(Type.Union([Type.String(), Type.Number()]))
        })
      )
    ),
    event_types: Type.Optional(Type.Array(Type.String())),
    /* Store Specific Settings */
    store_status: Type.Optional(
      Type.Record(
        Type.String(),
        Type.Object({
          near_mint: Type.Object({
            selling: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            buying: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            pos_id: Type.Optional(Type.String()),
            ecom_pid: Type.Optional(Type.String()),
            ecom_vid: Type.Optional(Type.String()),
            average_cost: Type.Optional(Type.Number())
          }),
          lightly_played: Type.Object({
            selling: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            buying: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            pos_id: Type.Optional(Type.String()),
            ecom_pid: Type.Optional(Type.String()),
            ecom_vid: Type.Optional(Type.String()),
            average_cost: Type.Optional(Type.Number())
          }),
          moderately_played: Type.Object({
            selling: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            buying: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            pos_id: Type.Optional(Type.String()),
            ecom_pid: Type.Optional(Type.String()),
            ecom_vid: Type.Optional(Type.String()),
            average_cost: Type.Optional(Type.Number())
          }),
          heavily_played: Type.Object({
            selling: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            buying: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            pos_id: Type.Optional(Type.String()),
            ecom_pid: Type.Optional(Type.String()),
            ecom_vid: Type.Optional(Type.String()),
            average_cost: Type.Optional(Type.Number())
          }),
          damaged: Type.Object({
            selling: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            buying: Type.Object({
              enabled: Type.Boolean({ default: false }),
              quantity: Type.Optional(Type.Number({ default: 0 }))
            }),
            pos_id: Type.Optional(Type.String()),
            ecom_pid: Type.Optional(Type.String()),
            ecom_vid: Type.Optional(Type.String()),
            average_cost: Type.Optional(Type.Number())
          })
        })
      )
    )
  },
  {
    $id: 'Products',
    additionalProperties: false
  }
)

export type Products = Static<typeof productsSchema>
export const productsValidator = getValidator(productsSchema, dataValidator)
export const productsResolver = resolve<Products, HookContext<ProductsService>>({})

export const productsExternalResolver = resolve<Products, HookContext<ProductsService>>({})

// Schema for creating new entries
export const productsDataSchema = Type.Pick(
  productsSchema,
  [
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
  ],
  {
    $id: 'ProductsData'
  }
)
export type ProductsData = Static<typeof productsDataSchema>
export const productsDataValidator = getValidator(productsDataSchema, dataValidator)
export const productsDataResolver = resolve<Products, HookContext<ProductsService>>({})
// Define a common schema for condition types

// Schema for updating existing entries
export const productsPatchSchema = Type.Intersect(
  [
    // Type.Partial(Type.Object({ 'selling.enabled': Type.Boolean() })),
    //  Type.Partial(Type.Object({ 'buying.enabled': Type.Boolean() })),
    //   Type.Partial(Type.Object({ 'buying.quantity': Type.Number() })),
    //   Type.Partial(Type.Object({ 'selling.quantity': Type.Number() })),
    Type.Partial(Type.Object({ name: Type.String() })),
    Type.Partial(Type.Object({ last_updated: Type.Number() })),
    Type.Partial(
      Type.Object({
        store_status: Type.Optional(
          Type.Record(
            Type.String(),
            Type.Object({
              near_mint: Type.Optional(conditionSchema),
              lightly_played: Type.Optional(conditionSchema),
              moderately_played: Type.Optional(conditionSchema),
              heavily_played: Type.Optional(conditionSchema),
              damaged: Type.Optional(conditionSchema)
            })
          )
        )
      })
    ),
    Type.Partial(
      Type.Object({
        market_price: Type.Number()
      })
    ),
    Type.Partial(
      Type.Object({
        low_price: Type.Number()
      })
    ),
    Type.Partial(
      Type.Object({
        high_price: Type.Number()
      })
    ),
    Type.Partial(
      Type.Object({
        mid_price: Type.Number()
      })
    ),
    Type.Partial(
      Type.Object({
        direct_low_price: Type.Number()
      })
    ),
    Type.Partial(
      Type.Object({
        type: Type.String()
      })
    ),
    Type.Partial(
      Type.Object({
        print: Type.String()
      })
    ),
    Type.Partial(
      Type.Object({
        finish: Type.String()
      })
    ),
    Type.Partial(
      Type.Object({
        collector_number: Type.Union([Type.String(), Type.Number()]),
        sort_number: Type.Union([Type.String(), Type.Number()])
      })
    ),
    Type.Partial(
      Type.Object({
        event_types: Type.Array(Type.String())
      })
    ),
    Type.Partial(
      Type.Object({
        set_id: ObjectIdSchema()
      })
    )
  ],
  {
    $id: 'ProductsPatch'
  }
)
export type ProductsPatch = Static<typeof productsPatchSchema>
export const productsPatchValidator = getValidator(productsPatchSchema, dataValidator)
export const productsPatchResolver = resolve<Products, HookContext<ProductsService>>({})

// Schema for allowed query properties
export const productsQueryProperties = Type.Pick(productsSchema, [
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
  'market_price',
  'type'
])

export const productsQuerySchema = Type.Intersect(
  [
    Type.Object({
      name: Type.Optional(
        Type.Union([
          queryProperty(Type.String()), // Allow plain string
          queryProperty(
            Type.Object({
              $regex: Type.Optional(Type.String()),
              $options: Type.Optional(Type.String())
            })
          )
          // Allow regex object
        ])
      ),
      $text: Type.Optional(
        queryProperty(
          Type.Object({
            $search: Type.Optional(Type.String())
          })
        )
      ),
      rarity: queryProperty(Type.String()),
      print: queryProperty(Type.String()),
      finish: queryProperty(Type.String()),
      rarities: Type.Optional(Type.Array(Type.String())),
      prints: Type.Optional(Type.Array(Type.String())),
      finishes: Type.Optional(Type.Array(Type.String())),
      event_types: queryProperty(Type.Array(Type.String())),
      market_price: queryProperty(Type.Number()),
      events: Type.Optional(Type.Array(Type.String())),
      excludeEvents: Type.Optional(Type.Boolean()),
      onlyEvents: Type.Optional(Type.Boolean()),
      excludePromo: Type.Optional(Type.Boolean()),
      onlyPromo: Type.Optional(Type.Boolean()),
      minPrice: Type.Optional(Type.Number()),
      maxPrice: Type.Optional(Type.Number()),
      store_status: queryProperty(Type.Any()),
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
      'external_id.tcgcsv_id': queryProperty(Type.Number()),
      'external_id.tcgcsv_group_id': queryProperty(Type.Number()),
      game_id: queryProperty(ObjectIdSchema()),
      set_id: queryProperty(ObjectIdSchema()),
      type: queryProperty(Type.String()),
      $sort: Type.Optional(
        Type.Object({
          'external_id.tcgcsv_group_id': Type.Optional(Type.Number()),
          sort_number: Type.Optional(Type.Number()),
          'price.market_price.Normal': Type.Optional(Type.Number()),
          'price.market_price.Foil': Type.Optional(Type.Number())
        })
      ),
      $limit: Type.Optional(Type.Number()),
      $skip: Type.Optional(Type.Number()),
      $or: Type.Optional(Type.Array(Type.Object({}))),
      $group: Type.Optional(Type.Object({})),
    })
  ],
  {
    additionalProperties: true
  }
)

export type ProductsQuery = Static<typeof productsQuerySchema>
export const productsQueryValidator = getValidator(productsQuerySchema, queryValidator)
export const productsQueryResolver = resolve<ProductsQuery, HookContext<ProductsService>>({})
