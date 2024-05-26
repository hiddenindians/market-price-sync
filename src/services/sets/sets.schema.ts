// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { SetsService } from './sets.class'


// Main data model schema
export const setsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    game_id: ObjectIdSchema(),
    name: Type.String(),
    external_id: Type.Object({
      tcgcsv_id: Type.Optional(Type.Number()),
    }),
    code: Type.Optional(Type.String()),
    enabled: Type.Boolean({default: false}),
    first_run: Type.Boolean(),
    store_status: Type.Array(Type.Object({
      store_id: ObjectIdSchema(),
      visible: Type.Boolean({ default: false })
    }))
  /* Scryfall/Pokemonio data */
  //parent_set_code: Type.Optional(Type.String()),
  //tcgplayer_id: Type.Optional(Type.String()),
  //search_uri: Type.Optional(Type.String()),
  //set_type: Type.Optional(Type.String()),
  //released_at: Type.Optional(Type.String()), //pokemonio releaseDate
  //card_count: Type.Optional(Type.Number()), //pokemonio printedTotal
  //icon_svg_uri: Type.Optional(Type.String()), //pokemonio images.symbol
  //printed_total: Type.Optional(Type.Number()),
  //logo: Type.Optional(Type.String()),
  //updated_at: Type.Optional(Type.String()),
  //unique to mtg
  //digital: Type.Optional(Type.Boolean()),
  //nonfoil_only: Type.Optional(Type.Boolean()),
  //foil_only: Type.Optional(Type.Boolean()),
  //unique to poke
  //images.logo
  //ptcgo_code: Type.Optional(Type.String()),    
  },
  { $id: 'Sets', additionalProperties: false }
)
export type Sets = Static<typeof setsSchema>
export const setsValidator = getValidator(setsSchema, dataValidator)
export const setsResolver = resolve<Sets, HookContext<SetsService>>({})

export const setsExternalResolver = resolve<Sets, HookContext<SetsService>>({})

// Schema for creating new entries
export const setsDataSchema = Type.Pick(setsSchema, ['game_id', 'name', 'external_id',], {
  $id: 'SetsData'
})
export type SetsData = Static<typeof setsDataSchema>
export const setsDataValidator = getValidator(setsDataSchema, dataValidator)
export const setsDataResolver = resolve<Sets, HookContext<SetsService>>({})

// Schema for updating existing entries
export const setsPatchSchema = Type.Partial(setsSchema, {
  $id: 'SetsPatch'
})
export type SetsPatch = Static<typeof setsPatchSchema>
export const setsPatchValidator = getValidator(setsPatchSchema, dataValidator)
export const setsPatchResolver = resolve<Sets, HookContext<SetsService>>({})

// Schema for allowed query properties
export const setsQueryProperties = Type.Pick(setsSchema, ['_id', 'name', 'enabled', 'game_id','external_id'])
export const setsQuerySchema = Type.Intersect(
  [
    querySyntax(setsQueryProperties, {name: { $regex: Type.String(), $options: Type.String()}}),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SetsQuery = Static<typeof setsQuerySchema>
export const setsQueryValidator = getValidator(setsQuerySchema, queryValidator)
export const setsQueryResolver = resolve<SetsQuery, HookContext<SetsService>>({})
