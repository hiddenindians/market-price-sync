import type { Static } from '@feathersjs/typebox';
import type { HookContext } from '../../declarations';
import type { ProductsService } from './products.class';
export declare const productsSchema: import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    game_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    set_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    external_id: import("@sinclair/typebox").TObject<{
        tcgcsv_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        tcgcsv_category_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        tcgcsv_group_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
    image_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    last_updated: import("@sinclair/typebox").TNumber;
    market_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    low_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    mid_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    high_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    direct_low_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    name: import("@sinclair/typebox").TString<string>;
    short_name: import("@sinclair/typebox").TString<string>;
    upc: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    rarity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    print: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    finish: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    collector_number: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    sort_number: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    extended_data: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        display_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    }>>>;
    event_types: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    store_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{
        near_mint: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        lightly_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        moderately_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        heavily_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        damaged: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    }>>>;
}>;
export type Products = Static<typeof productsSchema>;
export declare const productsValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const productsResolver: import("@feathersjs/schema").Resolver<{
    type?: string | undefined;
    finish?: string | undefined;
    text?: string | undefined;
    print?: string | undefined;
    market_price?: number | undefined;
    low_price?: number | undefined;
    mid_price?: number | undefined;
    high_price?: number | undefined;
    direct_low_price?: number | undefined;
    image_url?: string | undefined;
    average_cost?: number | undefined;
    pos_id?: string | undefined;
    upc?: string | undefined;
    rarity?: string | undefined;
    collector_number?: string | number | undefined;
    sort_number?: string | number | undefined;
    extended_data?: {
        name?: string | undefined;
        value?: string | number | undefined;
        display_name?: string | undefined;
    }[] | undefined;
    event_types?: string[] | undefined;
    store_status?: Record<string, {
        near_mint: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        lightly_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        moderately_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        heavily_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        damaged: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
    }> | undefined;
    name: string;
    _id: string | {};
    game_id: string | {};
    set_id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
        tcgcsv_category_id?: number | undefined;
        tcgcsv_group_id?: number | undefined;
    };
    last_updated: number;
    short_name: string;
}, HookContext<ProductsService<import("./products.class").ProductsParams>>>;
export declare const productsExternalResolver: import("@feathersjs/schema").Resolver<{
    type?: string | undefined;
    finish?: string | undefined;
    text?: string | undefined;
    print?: string | undefined;
    market_price?: number | undefined;
    low_price?: number | undefined;
    mid_price?: number | undefined;
    high_price?: number | undefined;
    direct_low_price?: number | undefined;
    image_url?: string | undefined;
    average_cost?: number | undefined;
    pos_id?: string | undefined;
    upc?: string | undefined;
    rarity?: string | undefined;
    collector_number?: string | number | undefined;
    sort_number?: string | number | undefined;
    extended_data?: {
        name?: string | undefined;
        value?: string | number | undefined;
        display_name?: string | undefined;
    }[] | undefined;
    event_types?: string[] | undefined;
    store_status?: Record<string, {
        near_mint: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        lightly_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        moderately_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        heavily_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        damaged: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
    }> | undefined;
    name: string;
    _id: string | {};
    game_id: string | {};
    set_id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
        tcgcsv_category_id?: number | undefined;
        tcgcsv_group_id?: number | undefined;
    };
    last_updated: number;
    short_name: string;
}, HookContext<ProductsService<import("./products.class").ProductsParams>>>;
export declare const productsDataSchema: import("@sinclair/typebox").TPick<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    game_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    set_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    external_id: import("@sinclair/typebox").TObject<{
        tcgcsv_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        tcgcsv_category_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        tcgcsv_group_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
    image_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    last_updated: import("@sinclair/typebox").TNumber;
    market_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    low_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    mid_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    high_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    direct_low_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    name: import("@sinclair/typebox").TString<string>;
    short_name: import("@sinclair/typebox").TString<string>;
    upc: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    rarity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    print: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    finish: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    collector_number: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    sort_number: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    extended_data: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        display_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    }>>>;
    event_types: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    store_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{
        near_mint: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        lightly_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        moderately_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        heavily_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        damaged: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    }>>>;
}>, ["game_id", "last_updated", "set_id", "external_id", "image_url", "name", "short_name", "type", "upc", "text", "rarity", "print", "finish", "event_types", "collector_number", "sort_number", "market_price", "low_price", "direct_low_price", "mid_price", "high_price", "average_cost", "extended_data"]>;
export type ProductsData = Static<typeof productsDataSchema>;
export declare const productsDataValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const productsDataResolver: import("@feathersjs/schema").Resolver<{
    type?: string | undefined;
    finish?: string | undefined;
    text?: string | undefined;
    print?: string | undefined;
    market_price?: number | undefined;
    low_price?: number | undefined;
    mid_price?: number | undefined;
    high_price?: number | undefined;
    direct_low_price?: number | undefined;
    image_url?: string | undefined;
    average_cost?: number | undefined;
    pos_id?: string | undefined;
    upc?: string | undefined;
    rarity?: string | undefined;
    collector_number?: string | number | undefined;
    sort_number?: string | number | undefined;
    extended_data?: {
        name?: string | undefined;
        value?: string | number | undefined;
        display_name?: string | undefined;
    }[] | undefined;
    event_types?: string[] | undefined;
    store_status?: Record<string, {
        near_mint: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        lightly_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        moderately_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        heavily_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        damaged: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
    }> | undefined;
    name: string;
    _id: string | {};
    game_id: string | {};
    set_id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
        tcgcsv_category_id?: number | undefined;
        tcgcsv_group_id?: number | undefined;
    };
    last_updated: number;
    short_name: string;
}, HookContext<ProductsService<import("./products.class").ProductsParams>>>;
export declare const productsPatchSchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString<string>;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    last_updated: import("@sinclair/typebox").TNumber;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    store_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{
        near_mint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            buying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
        lightly_played: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            buying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
        moderately_played: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            buying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
        heavily_played: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            buying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
        damaged: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            buying: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
    }>>>;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    market_price: import("@sinclair/typebox").TNumber;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    low_price: import("@sinclair/typebox").TNumber;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    high_price: import("@sinclair/typebox").TNumber;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    mid_price: import("@sinclair/typebox").TNumber;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    direct_low_price: import("@sinclair/typebox").TNumber;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TString<string>;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    print: import("@sinclair/typebox").TString<string>;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    finish: import("@sinclair/typebox").TString<string>;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    collector_number: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>;
    sort_number: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    event_types: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
}>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    set_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
}>>]>;
export type ProductsPatch = Static<typeof productsPatchSchema>;
export declare const productsPatchValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const productsPatchResolver: import("@feathersjs/schema").Resolver<{
    type?: string | undefined;
    finish?: string | undefined;
    text?: string | undefined;
    print?: string | undefined;
    market_price?: number | undefined;
    low_price?: number | undefined;
    mid_price?: number | undefined;
    high_price?: number | undefined;
    direct_low_price?: number | undefined;
    image_url?: string | undefined;
    average_cost?: number | undefined;
    pos_id?: string | undefined;
    upc?: string | undefined;
    rarity?: string | undefined;
    collector_number?: string | number | undefined;
    sort_number?: string | number | undefined;
    extended_data?: {
        name?: string | undefined;
        value?: string | number | undefined;
        display_name?: string | undefined;
    }[] | undefined;
    event_types?: string[] | undefined;
    store_status?: Record<string, {
        near_mint: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        lightly_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        moderately_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        heavily_played: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
        damaged: {
            average_cost?: number | undefined;
            pos_id?: string | undefined;
            ecom_pid?: string | undefined;
            ecom_vid?: string | undefined;
            selling: {
                quantity?: number | undefined;
                enabled: boolean;
            };
            buying: {
                quantity?: number | undefined;
                enabled: boolean;
            };
        };
    }> | undefined;
    name: string;
    _id: string | {};
    game_id: string | {};
    set_id: string | {};
    external_id: {
        tcgcsv_id?: number | undefined;
        tcgcsv_category_id?: number | undefined;
        tcgcsv_group_id?: number | undefined;
    };
    last_updated: number;
    short_name: string;
}, HookContext<ProductsService<import("./products.class").ProductsParams>>>;
export declare const productsQueryProperties: import("@sinclair/typebox").TPick<import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    game_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    set_id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>;
    external_id: import("@sinclair/typebox").TObject<{
        tcgcsv_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        tcgcsv_category_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        tcgcsv_group_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
    image_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    last_updated: import("@sinclair/typebox").TNumber;
    market_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    low_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    mid_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    high_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    direct_low_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    name: import("@sinclair/typebox").TString<string>;
    short_name: import("@sinclair/typebox").TString<string>;
    upc: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    rarity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    print: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    finish: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    collector_number: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    sort_number: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    extended_data: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        display_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TNumber]>>;
    }>>>;
    event_types: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    store_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{
        near_mint: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        lightly_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        moderately_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        heavily_played: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        damaged: import("@sinclair/typebox").TObject<{
            selling: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            buying: import("@sinclair/typebox").TObject<{
                enabled: import("@sinclair/typebox").TBoolean;
                quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>;
            pos_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_pid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            ecom_vid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            average_cost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    }>>>;
}>, ["collector_number", "_id", "text", "game_id", "external_id", "set_id", "name", "sort_number", "rarity", "print", "finish", "event_types", "market_price", "type"]>;
export declare const productsQuerySchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TString<string>;
        $gte: import("@sinclair/typebox").TString<string>;
        $lt: import("@sinclair/typebox").TString<string>;
        $lte: import("@sinclair/typebox").TString<string>;
        $ne: import("@sinclair/typebox").TString<string>;
        $in: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $nin: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>, import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $gte: import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $lt: import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $lte: import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $ne: import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $in: import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
        $nin: import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            $regex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
            $options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>]>>;
    $text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $gte: import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $lt: import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $lte: import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $ne: import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>;
        $in: import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
        $nin: import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            $search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
        }>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>>;
    rarity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TString<string>;
        $gte: import("@sinclair/typebox").TString<string>;
        $lt: import("@sinclair/typebox").TString<string>;
        $lte: import("@sinclair/typebox").TString<string>;
        $ne: import("@sinclair/typebox").TString<string>;
        $in: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $nin: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>;
    print: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TString<string>;
        $gte: import("@sinclair/typebox").TString<string>;
        $lt: import("@sinclair/typebox").TString<string>;
        $lte: import("@sinclair/typebox").TString<string>;
        $ne: import("@sinclair/typebox").TString<string>;
        $in: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $nin: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>;
    finish: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TString<string>;
        $gte: import("@sinclair/typebox").TString<string>;
        $lt: import("@sinclair/typebox").TString<string>;
        $lte: import("@sinclair/typebox").TString<string>;
        $ne: import("@sinclair/typebox").TString<string>;
        $in: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $nin: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>;
    rarities: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    prints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    finishes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    event_types: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $gte: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $lt: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $lte: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $ne: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $in: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
        $nin: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>;
    market_price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
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
    events: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>>;
    excludeEvents: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    onlyEvents: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    excludePromo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    onlyPromo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    minPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    maxPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    store_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TAny, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TAny;
        $gte: import("@sinclair/typebox").TAny;
        $lt: import("@sinclair/typebox").TAny;
        $lte: import("@sinclair/typebox").TAny;
        $ne: import("@sinclair/typebox").TAny;
        $in: import("@sinclair/typebox").TAny | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TAny>;
        $nin: import("@sinclair/typebox").TAny | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TAny>;
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
    'external_id.tcgcsv_group_id': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
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
    game_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
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
    set_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TObject<{}>]>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
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
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString<string>, import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        $gt: import("@sinclair/typebox").TString<string>;
        $gte: import("@sinclair/typebox").TString<string>;
        $lt: import("@sinclair/typebox").TString<string>;
        $lte: import("@sinclair/typebox").TString<string>;
        $ne: import("@sinclair/typebox").TString<string>;
        $in: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
        $nin: import("@sinclair/typebox").TString<string> | import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString<string>>;
    }>, import("@sinclair/typebox").TObject<{
        [key: string]: import("@sinclair/typebox").TSchema;
    }>]>>]>>;
    $sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        'external_id.tcgcsv_group_id': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        sort_number: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        'price.market_price.Normal': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        'price.market_price.Foil': import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>;
    $limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    $skip: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    $or: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{}>>>;
    $group: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{}>>;
}>]>;
export type ProductsQuery = Static<typeof productsQuerySchema>;
export declare const productsQueryValidator: import("@feathersjs/schema").Validator<any, any>;
export declare const productsQueryResolver: import("@feathersjs/schema").Resolver<{
    name?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | {
        $regex?: string | undefined;
        $options?: string | undefined;
    } | Partial<{
        $gt: {
            $regex?: string | undefined;
            $options?: string | undefined;
        };
        $gte: {
            $regex?: string | undefined;
            $options?: string | undefined;
        };
        $lt: {
            $regex?: string | undefined;
            $options?: string | undefined;
        };
        $lte: {
            $regex?: string | undefined;
            $options?: string | undefined;
        };
        $ne: {
            $regex?: string | undefined;
            $options?: string | undefined;
        };
        $in: {
            $regex?: string | undefined;
            $options?: string | undefined;
        } | {
            $regex?: string | undefined;
            $options?: string | undefined;
        }[];
        $nin: {
            $regex?: string | undefined;
            $options?: string | undefined;
        } | {
            $regex?: string | undefined;
            $options?: string | undefined;
        }[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    type?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    finish?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    print?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    events?: string[] | undefined;
    $limit?: number | undefined;
    $skip?: number | undefined;
    $sort?: {
        sort_number?: number | undefined;
        'external_id.tcgcsv_group_id'?: number | undefined;
        'price.market_price.Normal'?: number | undefined;
        'price.market_price.Foil'?: number | undefined;
    } | undefined;
    $or?: {}[] | undefined;
    $text?: {
        $search?: string | undefined;
    } | Partial<{
        $gt: {
            $search?: string | undefined;
        };
        $gte: {
            $search?: string | undefined;
        };
        $lt: {
            $search?: string | undefined;
        };
        $lte: {
            $search?: string | undefined;
        };
        $ne: {
            $search?: string | undefined;
        };
        $in: {
            $search?: string | undefined;
        } | {
            $search?: string | undefined;
        }[];
        $nin: {
            $search?: string | undefined;
        } | {
            $search?: string | undefined;
        }[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    market_price?: number | Partial<{
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
    game_id?: string | {} | Partial<{
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
    set_id?: string | {} | Partial<{
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
    rarity?: string | Partial<{
        $gt: string;
        $gte: string;
        $lt: string;
        $lte: string;
        $ne: string;
        $in: string | string[];
        $nin: string | string[];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    event_types?: string[] | Partial<{
        $gt: string[];
        $gte: string[];
        $lt: string[];
        $lte: string[];
        $ne: string[];
        $in: string[] | string[][];
        $nin: string[] | string[][];
    } & {
        [x: string]: unknown;
        [x: number]: unknown;
    }> | undefined;
    store_status?: any;
    rarities?: string[] | undefined;
    prints?: string[] | undefined;
    finishes?: string[] | undefined;
    excludeEvents?: boolean | undefined;
    onlyEvents?: boolean | undefined;
    excludePromo?: boolean | undefined;
    onlyPromo?: boolean | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
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
    'external_id.tcgcsv_group_id'?: number | Partial<{
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
    $group?: {} | undefined;
}, HookContext<ProductsService<import("./products.class").ProductsParams>>>;
