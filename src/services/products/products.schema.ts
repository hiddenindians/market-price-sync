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
      tcgcsv_group_id : Type.Optional(Type.Number()),
    }),
    image_url: Type.Optional(Type.String()),
    selling: Type.Object({
      enabled: Type.Boolean({ default: false }),
      quantity: Type.Optional(Type.Number({ default: 0 }))
    }),
    // selling: Type.Object({}),
    // "selling.enabled": Type.Boolean(),
    // "selling.quantity": Type.Number(),
    buying: Type.Object({
      enabled: Type.Boolean({ default: false }),
      quantity: Type.Optional(Type.Number({ default: 0 }))
    }),
    last_updated: Type.Number(),
    market_price: Type.Optional(Type.Array(Type.Object({}))),
    average_cost: Type.Optional(Type.Number()),
    pos_id: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    name: Type.String(),
    upc: Type.Optional(Type.String()),
    text: Type.Optional(Type.String()),
    rarity: Type.Optional(Type.String()),
    collector_number: Type.Optional(Type.String()),
    /* MTG */
    sub_type: Type.Optional(Type.String()),
    power: Type.Optional(Type.String()),
    toughness: Type.Optional(Type.String()),
    flavor_text: Type.Optional(Type.String()),
    /* Pokemon */
    card_type: Type.Optional(Type.String()), // OP + DBSFW
    hp: Type.Optional(Type.String()),
    stage: Type.Optional(Type.String()),
    attack_1: Type.Optional(Type.String()),
    attack_2: Type.Optional(Type.String()),
    attack_3: Type.Optional(Type.String()),
    attack_4: Type.Optional(Type.String()),
    weakness: Type.Optional(Type.String()),
    resistance: Type.Optional(Type.String()),
    retreat_cost: Type.Optional(Type.String()),
    /* One Piece & Fusion World */
    colour: Type.Optional(Type.String()),
    cost: Type.Optional(Type.String()),
    life: Type.Optional(Type.String()),
    counter: Type.Optional(Type.String()),
    attribute: Type.Optional(Type.String()),
    combo_power: Type.Optional(Type.String()),
    /* Lorcana */
    property: Type.Optional(Type.String()),
    character_version: Type.Optional(Type.String()),
    ink_type: Type.Optional(Type.String()),
    lore_value: Type.Optional(Type.String())
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
    'type',
    'upc',
    'text',
    'rarity',
    'collector_number',
    'sub_type',
    'power',
    'toughness',
    'flavor_text',
    'card_type',
    'hp',
    'stage',
    'attack_1',
    'attack_2',
    'attack_3',
    'attack_4',
    'weakness',
    'resistance',
    'retreat_cost',
    'colour',
    'cost',
    'life',
    'counter',
    'attribute',
    'combo_power',
    'property',
    'character_version',
    'ink_type',
    'lore_value',
    'market_price',
    'average_cost',
    'pos_id',
    'buying',
    'selling'
  ],
  {
    $id: 'ProductsData'
  }
)
export type ProductsData = Static<typeof productsDataSchema>
export const productsDataValidator = getValidator(productsDataSchema, dataValidator)
export const productsDataResolver = resolve<Products, HookContext<ProductsService>>({})

// Schema for updating existing entries
export const productsPatchSchema = Type.Intersect([
  Type.Partial(Type.Object({ 'selling.enabled': Type.Boolean() })),
  Type.Partial(Type.Object({ 'buying.enabled': Type.Boolean() })),
  Type.Partial(Type.Object({ 'buying.quantity': Type.Number() })),
  Type.Partial(Type.Object({ 'selling.quantity': Type.Number() })),
  Type.Partial(Type.Object({ 'last_updated': Type.Number() })), // Add this line
 
], {
  $id: 'ProductsPatch'
})
export type ProductsPatch = Static<typeof productsPatchSchema>
export const productsPatchValidator = getValidator(productsPatchSchema, dataValidator)
export const productsPatchResolver = resolve<Products, HookContext<ProductsService>>({})

// Schema for allowed query properties
export const productsQueryProperties = Type.Pick(productsSchema, [
  'market_price',
  'collector_number',
  '_id',
  'text',
  'game_id',
  'external_id',
  'set_id',
  'buying',
  'name',
  'pos_id'
])
// export const productsQuerySchema = Type.Object(
//   {
//     _id: queryProperty(ObjectIdSchema()),
//     game_id: queryProperty(Type.String()),
//     set_id: queryProperty(Type.String()),
//     collector_number: queryProperty(Type.String()),
//     selling: Type.Optional(Type.Object({
//       enabled: queryProperty(Type.Boolean()),
//       quantity: queryProperty(Type.Number())
//     })),
//     marketPrice:Type.Optional(
//       Type.Object({
//         normal: queryProperty(Type.Number()),
//         foil: queryProperty(Type.Number()),
//         reverse_foil: queryProperty(Type.Number())
//       })),

//   },
//   { additionalProperties: false }
// )
export const productsQuerySchema = Type.Intersect(
  [
    querySyntax(productsQueryProperties, {
      name: { $regex: Type.String(), $options: Type.String() }
    }),
    Type.Object(
      {
        'selling.enabled': queryProperty(Type.Boolean()),
        'selling.quantity': queryProperty(Type.Number()),
        'external_id.tcgcsv_id': queryProperty(Type.Number())
      },
      { additionalProperties: false }
    )
  ],
  {
    additionalProperties: false
  }
)

export type ProductsQuery = Static<typeof productsQuerySchema>
export const productsQueryValidator = getValidator(productsQuerySchema, queryValidator)
export const productsQueryResolver = resolve<ProductsQuery, HookContext<ProductsService>>({})
