// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  gamesDataValidator,
  gamesPatchValidator,
  gamesQueryValidator,
  gamesResolver,
  gamesExternalResolver,
  gamesDataResolver,
  gamesPatchResolver,
  gamesQueryResolver
} from './games.schema'

import type { Application } from '../../declarations'
import { GamesService, getOptions } from './games.class'
import { gamesPath, gamesMethods } from './games.shared'

export * from './games.class'
export * from './games.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const games = (app: Application) => {
  // Register our service on the Feathers application
  app.use(gamesPath, new GamesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: gamesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(gamesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(gamesExternalResolver),
        schemaHooks.resolveResult(gamesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(gamesQueryValidator), schemaHooks.resolveQuery(gamesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(gamesDataValidator), schemaHooks.resolveData(gamesDataResolver)],
      patch: [schemaHooks.validateData(gamesPatchValidator), schemaHooks.resolveData(gamesPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [gamesPath]: GamesService
  }
}
