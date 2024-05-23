// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  FetchGames,
  FetchGamesData,
  FetchGamesPatch,
  FetchGamesQuery,
  FetchGamesService
} from './fetch-games.class'

export type { FetchGames, FetchGamesData, FetchGamesPatch, FetchGamesQuery }

export type FetchGamesClientService = Pick<
  FetchGamesService<Params<FetchGamesQuery>>,
  (typeof fetchGamesMethods)[number]
>

export const fetchGamesPath = 'fetch-games'

export const fetchGamesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const fetchGamesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(fetchGamesPath, connection.service(fetchGamesPath), {
    methods: fetchGamesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [fetchGamesPath]: FetchGamesClientService
  }
}
