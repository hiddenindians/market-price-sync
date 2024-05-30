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
      create: [async () => {
        let startTime = Date.now()
        try {
          const data = await app.service('games').find({ query: { $limit: 100000 } });
          if (data.total != 0) {
            const results = data.data;
      
            // Fetch groups for all games in parallel
            const groupPromises = results.map(async (result) => {
              const externalId = result.external_id.tcgcsv_id;
              try {
                const response = await axios.get(`https://tcgcsv.com/${externalId}/groups`);
                return { result, groups: response.data.results };
              } catch (groupError) {
                console.error(`Error fetching groups for externalId ${externalId}:`, groupError);
                return { result, groups: [] };
              }
            });
      
            const groupsData = await Promise.all(groupPromises);
      
            // Process sets for all games in parallel
            const setPromises = groupsData.flatMap(({ result, groups }) => {
              return groups.map(async (group: any) => {
                try {
                  const setData = await app.service('sets').find({
                    query: {
                      game_id: result._id,
                      name: group.name,
                    }
                  });
      
                  if (setData.total == 0) {
                    await app.service('sets').create({
                      game_id: result._id,
                      name: group.name,
                      external_id: {
                        tcgcsv_id: group.groupId
                      }
                    });
                  }
                } catch (setError) {
                  console.error(`Error processing set for game_id ${result._id} and name ${group.name}:`);
                }
              });
            });
      
            await Promise.all(setPromises);
          }
        } catch (gameError) {
          console.error('Error fetching games:', gameError);
        }
        console.log(`Done. It took ${(Date.now() - startTime)/1000} seconds`)
      }
      ],
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
