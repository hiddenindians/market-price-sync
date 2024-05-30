// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PricesService } from './prices.class'

// Main data model schema
export const pricesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    product_id: ObjectIdSchema(),
    timestamp: Type.Number(),
    market_price: Type.Object({
      normal: Type.Optional(Type.Number()),
      foil: Type.Optional(Type.Number()),
      reverse_foil: Type.Optional(Type.Number())
    })
  },
  { $id: 'Prices', additionalProperties: false }
)
export type Prices = Static<typeof pricesSchema>
export const pricesValidator = getValidator(pricesSchema, dataValidator)
export const pricesResolver = resolve<Prices, HookContext<PricesService>>({})

export const pricesExternalResolver = resolve<Prices, HookContext<PricesService>>({})

// Schema for creating new entries
export const pricesDataSchema = Type.Pick(pricesSchema, ['timestamp', 'market_price', 'product_id'], {
  $id: 'PricesData'
})
export type PricesData = Static<typeof pricesDataSchema>
export const pricesDataValidator = getValidator(pricesDataSchema, dataValidator)
export const pricesDataResolver = resolve<Prices, HookContext<PricesService>>({})

// Schema for updating existing entries
export const pricesPatchSchema = Type.Partial(pricesSchema, {
  $id: 'PricesPatch'
})
export type PricesPatch = Static<typeof pricesPatchSchema>
export const pricesPatchValidator = getValidator(pricesPatchSchema, dataValidator)
export const pricesPatchResolver = resolve<Prices, HookContext<PricesService>>({})

// Schema for allowed query properties
export const pricesQueryProperties = Type.Pick(pricesSchema, ['_id', 'timestamp', 'market_price', 'product_id'])
export const pricesQuerySchema = Type.Intersect(
  [
    querySyntax(pricesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type PricesQuery = Static<typeof pricesQuerySchema>
export const pricesQueryValidator = getValidator(pricesQuerySchema, queryValidator)
export const pricesQueryResolver = resolve<PricesQuery, HookContext<PricesService>>({})
