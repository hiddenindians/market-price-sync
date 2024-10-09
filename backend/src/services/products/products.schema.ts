// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, queryProperty, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ProductsService } from './products.class'

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
    /* Store Specific Settings */
    store_status: Type.Optional(
      Type.Record(
        Type.String(),
        Type.Object({
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
          ecom_vid: Type.Optional(Type.String())
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
    'extended_data',
 
  ],
  {
    $id: 'ProductsData'
  }
)
export type ProductsData = Static<typeof productsDataSchema>
export const productsDataValidator = getValidator(productsDataSchema, dataValidator)
export const productsDataResolver = resolve<Products, HookContext<ProductsService>>({})

// Schema for updating existing entries
export const productsPatchSchema = Type.Intersect(
  [
    // Type.Partial(Type.Object({ 'selling.enabled': Type.Boolean() })),
    //  Type.Partial(Type.Object({ 'buying.enabled': Type.Boolean() })),
    //   Type.Partial(Type.Object({ 'buying.quantity': Type.Number() })),
    //   Type.Partial(Type.Object({ 'selling.quantity': Type.Number() })),
    Type.Partial(Type.Object({ last_updated: Type.Number() })),
    Type.Partial(
      Type.Object({
        store_status: Type.Optional(
          Type.Record(
            Type.String(),
            Type.Object({
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
              ecom_vid: Type.Optional(Type.String())
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
  'sort_number'
  ])

export const productsQuerySchema = Type.Intersect(
  [
    Type.Object(
      {
        'name': queryProperty(Type.String()),
        'store_status': queryProperty(Type.Any()),
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
        'external_id.tcgcsv_group_id':queryProperty(Type.Number()),
        'game_id': queryProperty(ObjectIdSchema()),
        'set_id': queryProperty(ObjectIdSchema()),
        $sort:
        Type.Optional(Type.Object({
          'external_id.tcgcsv_group_id': Type.Optional(Type.Number()),
          'sort_number': Type.Optional(Type.Number()),
          'price.market_price.Normal': Type.Optional(Type.Number()), 
          'price.market_price.Foil': Type.Optional(Type.Number()), 
        })),
        $limit: Type.Optional(Type.Number()),
        $skip: Type.Optional(Type.Number())   
      })
  ],
  {
    additionalProperties: true
  }
)

export type ProductsQuery = Static<typeof productsQuerySchema>
export const productsQueryValidator = getValidator(productsQuerySchema, queryValidator)
export const productsQueryResolver = resolve<ProductsQuery, HookContext<ProductsService>>({})
