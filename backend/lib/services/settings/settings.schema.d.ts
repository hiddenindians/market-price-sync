import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
import type { SettingsService } from './settings.class';
export declare const settingsSchema: import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    limit: import("@sinclair/typebox").TNumber;
    skip: import("@sinclair/typebox").TNumber;
    buylist_percentage: import("@sinclair/typebox").TNumber;
    timeout: import("@sinclair/typebox").TNumber;
    tcgcsv_last_updated: import("@sinclair/typebox").TNumber;
    store_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
}>;
export type Settings = Static<typeof settingsSchema>;
export declare const settingsValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const settingsResolver: import("@feathersjs/schema").Resolver<{
    timeout: number;
    _id: string | {};
    store_id: string | {};
    skip: number;
    limit: number;
    buylist_percentage: number;
    tcgcsv_last_updated: number;
}, HookContext<SettingsService<import("./settings.class").SettingsParams>>>;
export declare const settingsExternalResolver: import("@feathersjs/schema").Resolver<{
    timeout: number;
    _id: string | {};
    store_id: string | {};
    skip: number;
    limit: number;
    buylist_percentage: number;
    tcgcsv_last_updated: number;
}, HookContext<SettingsService<import("./settings.class").SettingsParams>>>;
export declare const settingsDataSchema: import("@sinclair/typebox").TPick<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    limit: import("@sinclair/typebox").TNumber;
    skip: import("@sinclair/typebox").TNumber;
    buylist_percentage: import("@sinclair/typebox").TNumber;
    timeout: import("@sinclair/typebox").TNumber;
    tcgcsv_last_updated: import("@sinclair/typebox").TNumber;
    store_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
}>, ["limit", "skip", "buylist_percentage", "timeout", "tcgcsv_last_updated"]>;
export type SettingsData = Static<typeof settingsDataSchema>;
export declare const settingsDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const settingsDataResolver: import("@feathersjs/schema").Resolver<{
    timeout: number;
    _id: string | {};
    store_id: string | {};
    skip: number;
    limit: number;
    buylist_percentage: number;
    tcgcsv_last_updated: number;
}, HookContext<SettingsService<import("./settings.class").SettingsParams>>>;
export declare const settingsPatchSchema: import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    limit: import("@sinclair/typebox").TNumber;
    skip: import("@sinclair/typebox").TNumber;
    buylist_percentage: import("@sinclair/typebox").TNumber;
    timeout: import("@sinclair/typebox").TNumber;
    tcgcsv_last_updated: import("@sinclair/typebox").TNumber;
    store_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
}>>;
export type SettingsPatch = Static<typeof settingsPatchSchema>;
export declare const settingsPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const settingsPatchResolver: import("@feathersjs/schema").Resolver<{
    timeout: number;
    _id: string | {};
    store_id: string | {};
    skip: number;
    limit: number;
    buylist_percentage: number;
    tcgcsv_last_updated: number;
}, HookContext<SettingsService<import("./settings.class").SettingsParams>>>;
export declare const settingsQueryProperties: import("@sinclair/typebox").TPick<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    limit: import("@sinclair/typebox").TNumber;
    skip: import("@sinclair/typebox").TNumber;
    buylist_percentage: import("@sinclair/typebox").TNumber;
    timeout: import("@sinclair/typebox").TNumber;
    tcgcsv_last_updated: import("@sinclair/typebox").TNumber;
    store_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
}>, ["_id"]>;
export declare const settingsQuerySchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    $limit: import("@sinclair/typebox").TNumber;
    $skip: import("@sinclair/typebox").TNumber;
    $sort: import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>;
    $select: import("@sinclair/typebox").TUnsafe<"_id"[]>;
    $and: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
            $gt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $gte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $lt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $lte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $ne: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $in: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
            $nin: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
        }>, import("@sinclair/typebox").TObject<{
            [key: string]: import("@sinclair/typebox").TSchema;
        } | undefined>]>>]>>;
    }>>, import("@sinclair/typebox").TObject<{
        $or: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
                $gt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
                $gte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
                $lt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
                $lte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
                $ne: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
                $in: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
                $nin: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
            }>, import("@sinclair/typebox").TObject<{
                [key: string]: import("@sinclair/typebox").TSchema;
            } | undefined>]>>]>>;
        }>>>;
    }>]>>;
    $or: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
            $gt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $gte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $lt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $lte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $ne: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
            $in: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
            $nin: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
        }>, import("@sinclair/typebox").TObject<{
            [key: string]: import("@sinclair/typebox").TSchema;
        } | undefined>]>>]>>;
    }>>>;
}>>, import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
        $gte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
        $lt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
        $lte: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
        $ne: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
        $in: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
        $nin: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    } | undefined>]>>]>>;
}>>]>, import("@sinclair/typebox").TObject<{}>]>;
export type SettingsQuery = Static<typeof settingsQuerySchema>;
export declare const settingsQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const settingsQueryResolver: import("@feathersjs/schema").Resolver<Partial<{
    $limit: number;
    $skip: number;
    $sort: {
        _id?: number | undefined;
    };
    $select: "_id"[];
    $and: ({
        _id?: string | {} | Partial<{
            $gt: string | {};
            $gte: string | {};
            $lt: string | {};
            $lte: string | {};
            $ne: string | {};
            $in: string | {} | (string | {})[];
            $nin: string | {} | (string | {})[];
        } & {}> | undefined;
    } | {
        $or: {
            _id?: string | {} | Partial<{
                $gt: string | {};
                $gte: string | {};
                $lt: string | {};
                $lte: string | {};
                $ne: string | {};
                $in: string | {} | (string | {})[];
                $nin: string | {} | (string | {})[];
            } & {}> | undefined;
        }[];
    })[];
    $or: {
        _id?: string | {} | Partial<{
            $gt: string | {};
            $gte: string | {};
            $lt: string | {};
            $lte: string | {};
            $ne: string | {};
            $in: string | {} | (string | {})[];
            $nin: string | {} | (string | {})[];
        } & {}> | undefined;
    }[];
}> & {
    _id?: string | {} | Partial<{
        $gt: string | {};
        $gte: string | {};
        $lt: string | {};
        $lte: string | {};
        $ne: string | {};
        $in: string | {} | (string | {})[];
        $nin: string | {} | (string | {})[];
    } & {}> | undefined;
} & {}, HookContext<SettingsService<import("./settings.class").SettingsParams>>>;
