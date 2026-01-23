import type { Static } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import type { SetsService } from './sets.class'
export declare const setsSchema: import('@sinclair/typebox').TObject<{
  _id: import('@sinclair/typebox').TUnion<
    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
  >
  game_id: import('@sinclair/typebox').TUnion<
    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
  >
  name: import('@sinclair/typebox').TString<string>
  external_id: import('@sinclair/typebox').TObject<{
    tcgcsv_id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  }>
  code: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
  enabled: import('@sinclair/typebox').TBoolean
  first_run: import('@sinclair/typebox').TBoolean
  store_status: import('@sinclair/typebox').TArray<
    import('@sinclair/typebox').TObject<{
      store_id: import('@sinclair/typebox').TUnion<
        [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
      >
      visible: import('@sinclair/typebox').TBoolean
    }>
  >
}>
export type Sets = Static<typeof setsSchema>
export declare const setsValidator: import('@feathersjs/schema').Validator<any, any>
export declare const setsResolver: import('@feathersjs/schema').Resolver<
  {
    code?: string | undefined
    name: string
    _id: string | {}
    game_id: string | {}
    external_id: {
      tcgcsv_id?: number | undefined
    }
    store_status: {
      visible: boolean
      store_id: string | {}
    }[]
    enabled: boolean
    first_run: boolean
  },
  HookContext<SetsService<import('./sets.class').SetsParams>>
>
export declare const setsExternalResolver: import('@feathersjs/schema').Resolver<
  {
    code?: string | undefined
    name: string
    _id: string | {}
    game_id: string | {}
    external_id: {
      tcgcsv_id?: number | undefined
    }
    store_status: {
      visible: boolean
      store_id: string | {}
    }[]
    enabled: boolean
    first_run: boolean
  },
  HookContext<SetsService<import('./sets.class').SetsParams>>
>
export declare const setsDataSchema: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    game_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    name: import('@sinclair/typebox').TString<string>
    external_id: import('@sinclair/typebox').TObject<{
      tcgcsv_id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    }>
    code: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
    enabled: import('@sinclair/typebox').TBoolean
    first_run: import('@sinclair/typebox').TBoolean
    store_status: import('@sinclair/typebox').TArray<
      import('@sinclair/typebox').TObject<{
        store_id: import('@sinclair/typebox').TUnion<
          [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
        >
        visible: import('@sinclair/typebox').TBoolean
      }>
    >
  }>,
  ['game_id', 'code', 'name', 'external_id']
>
export type SetsData = Static<typeof setsDataSchema>
export declare const setsDataValidator: import('@feathersjs/schema').Validator<any, any>
export declare const setsDataResolver: import('@feathersjs/schema').Resolver<
  {
    code?: string | undefined
    name: string
    _id: string | {}
    game_id: string | {}
    external_id: {
      tcgcsv_id?: number | undefined
    }
    store_status: {
      visible: boolean
      store_id: string | {}
    }[]
    enabled: boolean
    first_run: boolean
  },
  HookContext<SetsService<import('./sets.class').SetsParams>>
>
export declare const setsPatchSchema: import('@sinclair/typebox').TIntersect<
  [
    import('@sinclair/typebox').TPartial<
      import('@sinclair/typebox').TObject<{
        code: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
      }>
    >
  ]
>
export type SetsPatch = Static<typeof setsPatchSchema>
export declare const setsPatchValidator: import('@feathersjs/schema').Validator<any, any>
export declare const setsPatchResolver: import('@feathersjs/schema').Resolver<
  {
    code?: string | undefined
    name: string
    _id: string | {}
    game_id: string | {}
    external_id: {
      tcgcsv_id?: number | undefined
    }
    store_status: {
      visible: boolean
      store_id: string | {}
    }[]
    enabled: boolean
    first_run: boolean
  },
  HookContext<SetsService<import('./sets.class').SetsParams>>
>
export declare const setsQueryProperties: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    game_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    name: import('@sinclair/typebox').TString<string>
    external_id: import('@sinclair/typebox').TObject<{
      tcgcsv_id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    }>
    code: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
    enabled: import('@sinclair/typebox').TBoolean
    first_run: import('@sinclair/typebox').TBoolean
    store_status: import('@sinclair/typebox').TArray<
      import('@sinclair/typebox').TObject<{
        store_id: import('@sinclair/typebox').TUnion<
          [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
        >
        visible: import('@sinclair/typebox').TBoolean
      }>
    >
  }>,
  ['_id', 'name', 'enabled', 'game_id', 'external_id']
>
export declare const setsQuerySchema: import('@sinclair/typebox').TIntersect<
  [
    import('@sinclair/typebox').TObject<{
      _id: import('@sinclair/typebox').TOptional<
        import('@sinclair/typebox').TUnion<
          [
            import('@sinclair/typebox').TUnion<
              [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
            >,
            import('@sinclair/typebox').TPartial<
              import('@sinclair/typebox').TIntersect<
                [
                  import('@sinclair/typebox').TObject<{
                    $gt: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $gte: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $lt: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $lte: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $ne: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $in:
                      | import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TObject<{}>
                          ]
                        >
                      | import('@sinclair/typebox').TArray<
                          import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                        >
                    $nin:
                      | import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TObject<{}>
                          ]
                        >
                      | import('@sinclair/typebox').TArray<
                          import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                        >
                  }>,
                  import('@sinclair/typebox').TObject<{
                    [key: string]: import('@sinclair/typebox').TSchema
                  }>
                ]
              >
            >
          ]
        >
      >
      game_id: import('@sinclair/typebox').TOptional<
        import('@sinclair/typebox').TUnion<
          [
            import('@sinclair/typebox').TUnion<
              [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
            >,
            import('@sinclair/typebox').TPartial<
              import('@sinclair/typebox').TIntersect<
                [
                  import('@sinclair/typebox').TObject<{
                    $gt: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $gte: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $lt: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $lte: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $ne: import('@sinclair/typebox').TUnion<
                      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                    >
                    $in:
                      | import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TObject<{}>
                          ]
                        >
                      | import('@sinclair/typebox').TArray<
                          import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                        >
                    $nin:
                      | import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TObject<{}>
                          ]
                        >
                      | import('@sinclair/typebox').TArray<
                          import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                        >
                  }>,
                  import('@sinclair/typebox').TObject<{
                    [key: string]: import('@sinclair/typebox').TSchema
                  }>
                ]
              >
            >
          ]
        >
      >
      'external_id.tcgcsv_id': import('@sinclair/typebox').TOptional<
        import('@sinclair/typebox').TUnion<
          [
            import('@sinclair/typebox').TNumber,
            import('@sinclair/typebox').TPartial<
              import('@sinclair/typebox').TIntersect<
                [
                  import('@sinclair/typebox').TObject<{
                    $gt: import('@sinclair/typebox').TNumber
                    $gte: import('@sinclair/typebox').TNumber
                    $lt: import('@sinclair/typebox').TNumber
                    $lte: import('@sinclair/typebox').TNumber
                    $ne: import('@sinclair/typebox').TNumber
                    $in:
                      | import('@sinclair/typebox').TNumber
                      | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TNumber>
                    $nin:
                      | import('@sinclair/typebox').TNumber
                      | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TNumber>
                  }>,
                  import('@sinclair/typebox').TObject<{
                    [key: string]: import('@sinclair/typebox').TSchema
                  }>
                ]
              >
            >
          ]
        >
      >
      name: import('@sinclair/typebox').TOptional<
        import('@sinclair/typebox').TUnion<
          [
            import('@sinclair/typebox').TString<string>,
            import('@sinclair/typebox').TPartial<
              import('@sinclair/typebox').TIntersect<
                [
                  import('@sinclair/typebox').TObject<{
                    $gt: import('@sinclair/typebox').TString<string>
                    $gte: import('@sinclair/typebox').TString<string>
                    $lt: import('@sinclair/typebox').TString<string>
                    $lte: import('@sinclair/typebox').TString<string>
                    $ne: import('@sinclair/typebox').TString<string>
                    $in:
                      | import('@sinclair/typebox').TString<string>
                      | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TString<string>>
                    $nin:
                      | import('@sinclair/typebox').TString<string>
                      | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TString<string>>
                  }>,
                  import('@sinclair/typebox').TObject<{
                    [key: string]: import('@sinclair/typebox').TSchema
                  }>
                ]
              >
            >
          ]
        >
      >
      $sort: import('@sinclair/typebox').TOptional<
        import('@sinclair/typebox').TObject<{
          _id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
          'external_id.tcgcsv_id': import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
          name: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
        }>
      >
      $limit: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
      $skip: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    }>
  ]
>
export type SetsQuery = Static<typeof setsQuerySchema>
export declare const setsQueryValidator: import('@feathersjs/schema').Validator<any, any>
export declare const setsQueryResolver: import('@feathersjs/schema').Resolver<
  {
    name?:
      | string
      | Partial<
          {
            $gt: string
            $gte: string
            $lt: string
            $lte: string
            $ne: string
            $in: string | string[]
            $nin: string | string[]
          } & {
            [x: string]: unknown
            [x: number]: unknown
          }
        >
      | undefined
    _id?:
      | string
      | {}
      | Partial<
          {
            $gt: string | {}
            $gte: string | {}
            $lt: string | {}
            $lte: string | {}
            $ne: string | {}
            $in: string | {} | (string | {})[]
            $nin: string | {} | (string | {})[]
          } & {
            [x: string]: unknown
            [x: number]: unknown
          }
        >
      | undefined
    $limit?: number | undefined
    $skip?: number | undefined
    $sort?:
      | {
          name?: number | undefined
          _id?: number | undefined
          'external_id.tcgcsv_id'?: number | undefined
        }
      | undefined
    game_id?:
      | string
      | {}
      | Partial<
          {
            $gt: string | {}
            $gte: string | {}
            $lt: string | {}
            $lte: string | {}
            $ne: string | {}
            $in: string | {} | (string | {})[]
            $nin: string | {} | (string | {})[]
          } & {
            [x: string]: unknown
            [x: number]: unknown
          }
        >
      | undefined
    'external_id.tcgcsv_id'?:
      | number
      | Partial<
          {
            $gt: number
            $gte: number
            $lt: number
            $lte: number
            $ne: number
            $in: number | number[]
            $nin: number | number[]
          } & {
            [x: string]: unknown
            [x: number]: unknown
          }
        >
      | undefined
  },
  HookContext<SetsService<import('./sets.class').SetsParams>>
>
