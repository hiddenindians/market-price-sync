// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { SettingsService } from './settings.class'

// Main data model schema
export const settingsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    limit: Type.Number(),
    skip: Type.Number(),
    buylist_percentage: Type.Number(),
    timeout: Type.Number(),
    tcgcsv_last_updated: Type.Number(),
    store_id: ObjectIdSchema()
  },
  { $id: 'Settings', additionalProperties: false }
)
export type Settings = Static<typeof settingsSchema>
export const settingsValidator = getValidator(settingsSchema, dataValidator)
export const settingsResolver = resolve<Settings, HookContext<SettingsService>>({})

export const settingsExternalResolver = resolve<Settings, HookContext<SettingsService>>({})

// Schema for creating new entries
export const settingsDataSchema = Type.Pick(settingsSchema, [
  'limit',
  'skip',
  'buylist_percentage',
  'timeout',
  'tcgcsv_last_updated',
], {
  $id: 'SettingsData'
})
export type SettingsData = Static<typeof settingsDataSchema>
export const settingsDataValidator = getValidator(settingsDataSchema, dataValidator)
export const settingsDataResolver = resolve<Settings, HookContext<SettingsService>>({})

// Schema for updating existing entries
export const settingsPatchSchema = Type.Partial(settingsSchema, {
  $id: 'SettingsPatch'
})
export type SettingsPatch = Static<typeof settingsPatchSchema>
export const settingsPatchValidator = getValidator(settingsPatchSchema, dataValidator)
export const settingsPatchResolver = resolve<Settings, HookContext<SettingsService>>({})

// Schema for allowed query properties
export const settingsQueryProperties = Type.Pick(settingsSchema, ['_id',])
export const settingsQuerySchema = Type.Intersect(
  [
    querySyntax(settingsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SettingsQuery = Static<typeof settingsQuerySchema>
export const settingsQueryValidator = getValidator(settingsQuerySchema, queryValidator)
export const settingsQueryResolver = resolve<SettingsQuery, HookContext<SettingsService>>({})
