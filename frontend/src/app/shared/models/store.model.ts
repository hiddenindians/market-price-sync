export interface Store {
    _id: string
    name: string
    admin: string
    enabled_sets: [],
    enabled_games: [],
    enabled_oems: [],
    enabled_consoles: [],
    allow_buying: boolean,
    allow_selling: boolean
}