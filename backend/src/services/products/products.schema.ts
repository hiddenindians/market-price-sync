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
    price: Type.Object({
      market_price: Type.Optional(
        Type.Object({
          foil: Type.Optional(Type.Number()),
          normal: Type.Optional(Type.Number()),
          reverse_foil: Type.Optional(Type.Number())
        })
      ),
      low_price: Type.Optional(
        Type.Object({
          foil: Type.Optional(Type.Number()),
          normal: Type.Optional(Type.Number()),
          reverse_foil: Type.Optional(Type.Number())
        })
      ),
      mid_price: Type.Optional(
        Type.Object({
          foil: Type.Optional(Type.Number()),
          normal: Type.Optional(Type.Number()),
          reverse_foil: Type.Optional(Type.Number())
        })
      ),
      high_price: Type.Optional(
        Type.Object({
          foil: Type.Optional(Type.Number()),
          normal: Type.Optional(Type.Number()),
          reverse_foil: Type.Optional(Type.Number())
        })
      ),
      direct_low_price: Type.Optional(
        Type.Object({
          foil: Type.Optional(Type.Number()),
          normal: Type.Optional(Type.Number()),
          reverse_foil: Type.Optional(Type.Number())
        })
      ),
      timestamp: Type.Optional(Type.Number())
    }),
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
    retreat_cost: Type.Optional(Type.Number()),
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
    lore_value: Type.Optional(Type.String()),
    classification: Type.Optional(Type.String()),
    promo_type: Type.Optional(Type.String()),
    move_cost: Type.Optional(Type.String()),
    /* Yu Gi Oh! */
    monster_type: Type.Optional(Type.String()),
    attack: Type.Optional(Type.Number()),
    defense: Type.Optional(Type.Number()),
    link_arrows: Type.Optional(Type.String()),
    link_rating: Type.Optional(Type.Number()),
    /* Cardfight Vanguard */
    unit: Type.Optional(Type.String()),
    grade: Type.Optional(Type.Number()),
    skill_icon: Type.Optional(Type.String()),
    nation: Type.Optional(Type.String()),
    race: Type.Optional(Type.String()),
    shield: Type.Optional(Type.Number()),
    critical: Type.Optional(Type.Number()),
    trigger: Type.Optional(Type.String()),
    imaginary_gift: Type.Optional(Type.String()),
    clan: Type.Optional(Type.String()),
    /* Force of Will */
    rules_text: Type.Optional(Type.String()),
    atk: Type.Optional(Type.Number()),
    def: Type.Optional(Type.Number()),
    total_cost: Type.Optional(Type.Number()),
    attribute_2: Type.Optional(Type.String()),
    divinity: Type.Optional(Type.Number()),
    /* heroclix */
    universe: Type.Optional(Type.String()),
    team: Type.Optional(Type.String()),
    rank: Type.Optional(Type.String()),
    point_value: Type.Optional(Type.Number()),
    attacks: Type.Optional(Type.Number()),
    range: Type.Optional(Type.Number()),
    /* Dice Masters */
    affiliation: Type.Optional(Type.String()),
    affiliation_2: Type.Optional(Type.String()),
    max_dice: Type.Optional(Type.Number()),

    energy_type: Type.Optional(Type.String()),
    /* Weiss Schwarz */
    level: Type.Optional(Type.Number()),

    trait: Type.Optional(Type.String()),
    trait_2: Type.Optional(Type.String()),
    soul: Type.Optional(Type.Number()),
    triggers: Type.Optional(Type.String()),
    /* FF TCG */
    element: Type.Optional(Type.String()),
    category: Type.Optional(Type.String()),
    job: Type.Optional(Type.String()),

    /* Shadowverse Evolved */
    class: Type.Optional(Type.String()),

    /* WIXOSS */
    limit: Type.Optional(Type.Number()),
    team_name: Type.Optional(Type.String()),
    LRIG_type_class: Type.Optional(Type.String()),
    gtin: Type.Optional(Type.Number()),
    sku: Type.Optional(Type.String()),
    product_weight: Type.Optional(Type.String()),
    dimensions: Type.Optional(Type.String()),
    grow_cost: Type.Optional(Type.String()),
    timing: Type.Optional(Type.String()),

    /* Star Wars Unl */
    traits: Type.Optional(Type.String()),
    arena_type: Type.Optional(Type.String()),
    aspect: Type.Optional(Type.String()),

    /* Alpha Clash */
    character_name: Type.Optional(Type.String()),
    resource_cost: Type.Optional(Type.String()),
    planet_name: Type.Optional(Type.String()),
    location_name: Type.Optional(Type.String()),

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
          pos_id: Type.Optional(Type.String())
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
    'price',
    'average_cost',
    // 'buying',
    // 'selling',
    'monster_type',
    'attack',
    'defense',
    'link_arrows',
    'link_rating',
    'unit',
    'grade',
    'skill_icon',
    'nation',
    'race',
    'shield',
    'critical',
    'trigger',
    'imaginary_gift',
    'clan',
    'divinity',
    'universe',
    'team',
    'rank',
    'point_value',
    'attacks',
    'range',
    'affiliation',
    'energy_type',
    'affiliation_2',
    'max_dice',
    'element',
    'job',
    'category',
    'gtin',
    'sku',
    'limit',
    'team_name',
    'LRIG_type_class',
    'classification',
    'promo_type',
    'grow_cost',
    'timing',
    'class',
    'traits',
    'arena_type',
    'aspect',
    'move_cost',
    'character_name',
    'resource_cost',
    'planet_name',
    'location_name',
    'extended_data'
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
        price: Type.Object({
          foil: Type.Optional(Type.Number()),
          normal: Type.Optional(Type.Number()),
          reverse_foil: Type.Optional(Type.Number()),
          timestamp: Type.Number()
        })
      })
    ),
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
              pos_id: Type.Optional(Type.String())
            })
          )
        )
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
    Type.Object(
      {
        'name': queryProperty(Type.String()),
        'store_status': Type.Optional(
          Type.Record(
            Type.String(),
            Type.Object({
              pos_id: queryProperty(Type.String()),
              selling: Type.Optional(
                Type.Object({
                  enabled: queryProperty(Type.Boolean()),
                  quantity: queryProperty(Type.Number())
                })
              ),
              buying: Type.Optional(
                Type.Object({
                  enabled: queryProperty(Type.Boolean()),
                  quantity: queryProperty(Type.Number())
                })
              )
            })
          )
        ),
        'external_id.tcgcsv_id': queryProperty(Type.Number()),
        'external_id.tcgcsv_group_id':queryProperty(Type.Number()),
        'game_id': queryProperty(ObjectIdSchema()),
        'set_id': queryProperty(ObjectIdSchema()),
        $sort:Type.Optional(Type.Object({
          'external_id.tcgcsv_group_id': Type.Optional(Type.Number()),
          'sort_number': Type.Optional(Type.Number())
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
