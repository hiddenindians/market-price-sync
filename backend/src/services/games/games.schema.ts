import { resolve } from '@feathersjs/schema'
import { Type, getValidator, queryProperty } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { GamesService } from './games.class'

// Main data model schema
export const gamesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.String(),
    logo: Type.Optional(Type.String()),
    external_id: Type.Object({
      tcgcsv_id: Type.Optional(Type.Number()),
    }),
    enabled: Type.Boolean({default: false}),
  },
  { $id: 'Games', additionalProperties: false }
)
export type Games = Static<typeof gamesSchema>
export const gamesValidator = getValidator(gamesSchema, dataValidator)
export const gamesResolver = resolve<Games, HookContext<GamesService>>({})

export const gamesExternalResolver = resolve<Games, HookContext<GamesService>>({})

// Schema for creating new entries
export const gamesDataSchema = Type.Pick(gamesSchema, ['name', 'external_id','logo'], {
  $id: 'GamesData'
})
export type GamesData = Static<typeof gamesDataSchema>
export const gamesDataValidator = getValidator(gamesDataSchema, dataValidator)
export const gamesDataResolver = resolve<Games, HookContext<GamesService>>({})

// Schema for updating existing entries
export const gamesPatchSchema = Type.Partial(gamesSchema, {
  $id: 'GamesPatch'
})
export type GamesPatch = Static<typeof gamesPatchSchema>
export const gamesPatchValidator = getValidator(gamesPatchSchema, dataValidator)
export const gamesPatchResolver = resolve<Games, HookContext<GamesService>>({})

// Schema for allowed query properties
export const gamesQuerySchema = Type.Object(
  {
    _id: queryProperty(ObjectIdSchema()),
    'external_id.tcgcsv_id': queryProperty(Type.Number()),
    enabled: queryProperty(Type.Boolean()),
    $sort: Type.Optional(
      Type.Object({
        '_id': Type.Optional(Type.Number()),
        'external_id.tcgcsv_id': Type.Optional(Type.Number()),
        'name': Type.Optional(Type.Number()),
      
      })
    ),
    $limit: Type.Optional(Type.Number()),
    $skip: Type.Optional(Type.Number())
  },
  { additionalProperties: false }
)
export type GamesQuery = Static<typeof gamesQuerySchema>
export const gamesQueryValidator = getValidator(gamesQuerySchema, queryValidator)
export const gamesQueryResolver = resolve<GamesQuery, HookContext<GamesService>>({})