// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  FetchSets,
  FetchSetsData,
  FetchSetsPatch,
  FetchSetsQuery,
  FetchSetsService
} from './fetch-sets.class'

export type { FetchSets, FetchSetsData, FetchSetsPatch, FetchSetsQuery }

export type FetchSetsClientService = Pick<
  FetchSetsService<Params<FetchSetsQuery>>,
  (typeof fetchSetsMethods)[number]
>

export const fetchSetsPath = 'fetch-sets'

export const fetchSetsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const fetchSetsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(fetchSetsPath, connection.service(fetchSetsPath), {
    methods: fetchSetsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [fetchSetsPath]: FetchSetsClientService
  }
}
