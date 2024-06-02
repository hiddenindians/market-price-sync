// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { StoresService } from './stores.class'

// Main data model schema
export const storesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.String(),
    enabled_sets: Type.Array(Type.Any()),
    enabled_games: Type.Array(Type.Any()),
    enabled_oems: Type.Array(Type.Any()),
    enabled_consoles: Type.Array(Type.Any()),
    allow_buying: Type.Boolean(),
    allow_selling: Type.Boolean(),
    admin_id: ObjectIdSchema()
  },
  { $id: 'Stores', additionalProperties: false }
)
export type Stores = Static<typeof storesSchema>
export const storesValidator = getValidator(storesSchema, dataValidator)
export const storesResolver = resolve<Stores, HookContext<StoresService>>({})

export const storesExternalResolver = resolve<Stores, HookContext<StoresService>>({})

// Schema for creating new entries
export const storesDataSchema = Type.Pick(storesSchema, ['name', 'admin_id'], {
  $id: 'StoresData'
})
export type StoresData = Static<typeof storesDataSchema>
export const storesDataValidator = getValidator(storesDataSchema, dataValidator)
export const storesDataResolver = resolve<Stores, HookContext<StoresService>>({})

// Schema for updating existing entries
export const storesPatchSchema = Type.Partial(storesSchema, {
  $id: 'StoresPatch'
})
export type StoresPatch = Static<typeof storesPatchSchema>
export const storesPatchValidator = getValidator(storesPatchSchema, dataValidator)
export const storesPatchResolver = resolve<Stores, HookContext<StoresService>>({})

// Schema for allowed query properties
export const storesQueryProperties = Type.Pick(storesSchema, ['_id', 'name'])
export const storesQuerySchema = Type.Intersect(
  [
    querySyntax(storesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type StoresQuery = Static<typeof storesQuerySchema>
export const storesQueryValidator = getValidator(storesQuerySchema, queryValidator)
export const storesQueryResolver = resolve<StoresQuery, HookContext<StoresService>>({})
