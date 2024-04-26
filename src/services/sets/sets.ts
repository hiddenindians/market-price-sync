// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  setsDataValidator,
  setsPatchValidator,
  setsQueryValidator,
  setsResolver,
  setsExternalResolver,
  setsDataResolver,
  setsPatchResolver,
  setsQueryResolver
} from './sets.schema'

import type { Application } from '../../declarations'
import { SetsService, getOptions } from './sets.class'
import { setsPath, setsMethods } from './sets.shared'

export * from './sets.class'
export * from './sets.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const sets = (app: Application) => {
  // Register our service on the Feathers application
  app.use(setsPath, new SetsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: setsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(setsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(setsExternalResolver),
        schemaHooks.resolveResult(setsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(setsQueryValidator), schemaHooks.resolveQuery(setsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(setsDataValidator), schemaHooks.resolveData(setsDataResolver)],
      patch: [schemaHooks.validateData(setsPatchValidator), schemaHooks.resolveData(setsPatchResolver)],
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
    [setsPath]: SetsService
  }
}
