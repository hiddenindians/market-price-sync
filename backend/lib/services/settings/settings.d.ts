import type { Application } from '../../declarations';
import { SettingsService } from './settings.class';
import { settingsPath } from './settings.shared';
export * from './settings.class';
export * from './settings.schema';
export declare const settings: (app: Application) => void;
declare module '../../declarations' {
    interface ServiceTypes {
        [settingsPath]: SettingsService;
    }
}
