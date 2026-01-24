import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
import type { GamesService } from './games.class';
export declare const gamesSchema: import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    name: import("@sinclair/typebox").TString<string>;
    logo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    external_id: import("@sinclair/typebox").TObject<{
        tcgcsv_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
    enabled: import("@sinclair/typebox").TBoolean;
}>;
export type Games = Static<typeof gamesSchema>;
export declare const gamesValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const gamesResolver: import("@feathersjs/schema").Resolver<{
    logo?: string | undefined;
    name: string;
    _id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
    };
    enabled: boolean;
}, HookContext<GamesService<import("./games.class").GamesParams>>>;
export declare const gamesExternalResolver: import("@feathersjs/schema").Resolver<{
    logo?: string | undefined;
    name: string;
    _id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
    };
    enabled: boolean;
}, HookContext<GamesService<import("./games.class").GamesParams>>>;
export declare const gamesDataSchema: import("@sinclair/typebox").TPick<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    name: import("@sinclair/typebox").TString<string>;
    logo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    external_id: import("@sinclair/typebox").TObject<{
        tcgcsv_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
    enabled: import("@sinclair/typebox").TBoolean;
}>, ["name", "external_id", "logo"]>;
export type GamesData = Static<typeof gamesDataSchema>;
export declare const gamesDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const gamesDataResolver: import("@feathersjs/schema").Resolver<{
    logo?: string | undefined;
    name: string;
    _id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
    };
    enabled: boolean;
}, HookContext<GamesService<import("./games.class").GamesParams>>>;
export declare const gamesPatchSchema: import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    name: import("@sinclair/typebox").TString<string>;
    logo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    external_id: import("@sinclair/typebox").TObject<{
        tcgcsv_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
    enabled: import("@sinclair/typebox").TBoolean;
}>>;
export type GamesPatch = Static<typeof gamesPatchSchema>;
export declare const gamesPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const gamesPatchResolver: import("@feathersjs/schema").Resolver<{
    logo?: string | undefined;
    name: string;
    _id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
    };
    enabled: boolean;
}, HookContext<GamesService<import("./games.class").GamesParams>>>;
export declare const gamesQuerySchema: import("@sinclair/typebox").TObject<{
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
    }>]>>]>>;
    'external_id.tcgcsv_id': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TNumber;
        $gte: import("@sinclair/typebox").TNumber;
        $lt: import("@sinclair/typebox").TNumber;
        $lte: import("@sinclair/typebox").TNumber;
        $ne: import("@sinclair/typebox").TNumber;
        $in: import("@sinclair/typebox").TNumber | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
        $nin: import("@sinclair/typebox").TNumber | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>;
    enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TBoolean;
        $gte: import("@sinclair/typebox").TBoolean;
        $lt: import("@sinclair/typebox").TBoolean;
        $lte: import("@sinclair/typebox").TBoolean;
        $ne: import("@sinclair/typebox").TBoolean;
        $in: import("@sinclair/typebox").TBoolean | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TBoolean>;
        $nin: import("@sinclair/typebox").TBoolean | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TBoolean>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>;
    $sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        'external_id.tcgcsv_id': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>;
    $limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    $skip: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export type GamesQuery = Static<typeof gamesQuerySchema>;
export declare const gamesQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const gamesQueryResolver: import("@feathersjs/schema").Resolver<{
    _id?: string | {} | Partial<{
        $gt: string | {};
        $gte: string | {};
        $lt: string | {};
        $lte: string | {};
        $ne: string | {};
        $in: string | {} | (string | {})[];
        $nin: string | {} | (string | {})[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    $limit?: number | undefined;
    $skip?: number | undefined;
    $sort?: {
        name?: number | undefined;
        _id?: number | undefined;
        'external_id.tcgcsv_id'?: number | undefined;
    } | undefined;
    enabled?: boolean | Partial<{
        $gt: boolean;
        $gte: boolean;
        $lt: boolean;
        $lte: boolean;
        $ne: boolean;
        $in: boolean | boolean[];
        $nin: boolean | boolean[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    'external_id.tcgcsv_id'?: number | Partial<{
        $gt: number;
        $gte: number;
        $lt: number;
        $lte: number;
        $ne: number;
        $in: number | number[];
        $nin: number | number[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
}, HookContext<GamesService<import("./games.class").GamesParams>>>;
