import type { Params } from '@feathersjs/feathers';
import type { ClientApplication } from '../../client';
import type { Settings, SettingsData, SettingsPatch, SettingsQuery, SettingsService } from './settings.class';
export type { Settings, SettingsData, SettingsPatch, SettingsQuery };
export type SettingsClientService = Pick<SettingsService<Params<SettingsQuery>>, (typeof settingsMethods)[number]>;
export declare const settingsPath = "settings";
export declare const settingsMethods: readonly ["find", "get", "create", "patch", "remove"];
export declare const settingsClient: (client: ClientApplication) => void;
declare module '../../client' {
    interface ServiceTypes {
        [settingsPath]: SettingsClientService;
    }
}
