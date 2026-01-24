import type { TransportConnection, Application } from '@feathersjs/feathers';
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client';
import './services/stores/stores.shared';
export type { Stores, StoresData, StoresQuery, StoresPatch } from './services/stores/stores.shared';
import './services/fetch-products-and-prices/fetch-products-and-prices.shared';
export type { FetchProductsAndPrices, FetchProductsAndPricesData, FetchProductsAndPricesQuery, FetchProductsAndPricesPatch } from './services/fetch-products-and-prices/fetch-products-and-prices.shared';
import './services/fetch-sets/fetch-sets.shared';
export type { FetchSets, FetchSetsData, FetchSetsQuery, FetchSetsPatch } from './services/fetch-sets/fetch-sets.shared';
import './services/fetch-games/fetch-games.shared';
export type { FetchGames, FetchGamesData, FetchGamesQuery, FetchGamesPatch } from './services/fetch-games/fetch-games.shared';
import './services/settings/settings.shared';
export type { Settings, SettingsData, SettingsQuery, SettingsPatch } from './services/settings/settings.shared';
import './services/prices/prices.shared';
export type { Prices, PricesData, PricesQuery, PricesPatch } from './services/prices/prices.shared';
import './services/products/products.shared';
export type { Products, ProductsData, ProductsQuery, ProductsPatch } from './services/products/products.shared';
import './services/product-filters/product-filters.shared';
export type { ProductFiltersResult } from './services/product-filters/product-filters.shared';
import './services/sets/sets.shared';
export type { Sets, SetsData, SetsQuery, SetsPatch } from './services/sets/sets.shared';
import './services/games/games.shared';
export type { Games, GamesData, GamesQuery, GamesPatch } from './services/games/games.shared';
import './services/users/users.shared';
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared';
export interface Configuration {
    connection: TransportConnection<ServiceTypes>;
}
export interface ServiceTypes {
}
export type ClientApplication = Application<ServiceTypes, Configuration>;
/**
 * Returns a typed client for the mps app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export declare const createClient: <Configuration = any>(connection: TransportConnection<ServiceTypes>, authenticationOptions?: Partial<AuthenticationClientOptions>) => ClientApplication;
