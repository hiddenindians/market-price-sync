// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { FetchSetsService, getOptions } from './fetch-sets.class'
import { fetchSetsPath, fetchSetsMethods } from './fetch-sets.shared'
import axios from 'axios';  // Corrected import statement

export * from './fetch-sets.class'

// A configure function that registers the service and its hooks via `app.configure`
export const fetchSets = (app: Application) => {
  // Register our service on the Feathers application
  app.use(fetchSetsPath, new FetchSetsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: fetchSetsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(fetchSetsPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [async ()=>{
        await app.service('games').find({query: {$limit: 100000}}).then(async (data) => {
          if (data.total != 0) {
            let results = data.data
            results.forEach(async (result) => {
              let externalId = result.external_id.tcgcsv_id
              await axios.get(`https://tcgcsv.com/${externalId}/groups`).then(async (data: any) => {
                let d = data.data.results
                for (var i = 0; i < d.length; i++) {
                  await app
                    .service('sets')
                    .find({
                      query: {
                        game_id: result._id,
                        name: d[i].name,
                      }
                    })
                    .then(async (data) => {
                      if (data.total == 0) {
                        app.service('sets').create({
                          game_id: result._id, //fixme
                          name: d[i].name,
                          external_id: {
                            tcgcsv_id: d[i].groupId
                          }
                        })
                      }
                    })
                }
              })
            })
          }
        })

      }],
      patch: [],
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
    [fetchSetsPath]: FetchSetsService
  }
}
