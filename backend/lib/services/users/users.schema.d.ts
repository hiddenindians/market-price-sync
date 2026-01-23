import type { Static } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import type { UserService } from './users.class'
export declare const userSchema: import('@sinclair/typebox').TObject<{
  _id: import('@sinclair/typebox').TUnion<
    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
  >
  email: import('@sinclair/typebox').TString<'email'>
  username: import('@sinclair/typebox').TString<string>
  password: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
  store_id: import('@sinclair/typebox').TOptional<
    import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
  >
  role: import('@sinclair/typebox').TOptional<
    import('@sinclair/typebox').TEnum<{
      readonly ADMIN: 'admin'
      readonly MANAGER: 'manager'
      readonly EMPLOYEE: 'employee'
    }>
  >
}>
export type User = Static<typeof userSchema>
export declare const userValidator: import('@feathersjs/schema').Validator<any, any>
export declare const userResolver: import('@feathersjs/schema').Resolver<
  {
    role?: 'admin' | 'manager' | 'employee' | undefined
    password?: string | undefined
    store_id?: string | {} | undefined
    username: string
    email: string
    _id: string | {}
  },
  HookContext<UserService<import('./users.class').UserParams>>
>
export declare const userExternalResolver: import('@feathersjs/schema').Resolver<
  {
    role?: 'admin' | 'manager' | 'employee' | undefined
    password?: string | undefined
    store_id?: string | {} | undefined
    username: string
    email: string
    _id: string | {}
  },
  HookContext<UserService<import('./users.class').UserParams>>
>
export declare const userDataSchema: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    email: import('@sinclair/typebox').TString<'email'>
    username: import('@sinclair/typebox').TString<string>
    password: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
    store_id: import('@sinclair/typebox').TOptional<
      import('@sinclair/typebox').TUnion<
        [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
      >
    >
    role: import('@sinclair/typebox').TOptional<
      import('@sinclair/typebox').TEnum<{
        readonly ADMIN: 'admin'
        readonly MANAGER: 'manager'
        readonly EMPLOYEE: 'employee'
      }>
    >
  }>,
  ['email', 'password', 'username', 'store_id', 'role']
>
export type UserData = Static<typeof userDataSchema>
export declare const userDataValidator: import('@feathersjs/schema').Validator<any, any>
export declare const userDataResolver: import('@feathersjs/schema').Resolver<
  {
    role?: 'admin' | 'manager' | 'employee' | undefined
    password?: string | undefined
    store_id?: string | {} | undefined
    username: string
    email: string
    _id: string | {}
  },
  HookContext<UserService<import('./users.class').UserParams>>
>
export declare const userPatchSchema: import('@sinclair/typebox').TPartial<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    email: import('@sinclair/typebox').TString<'email'>
    username: import('@sinclair/typebox').TString<string>
    password: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
    store_id: import('@sinclair/typebox').TOptional<
      import('@sinclair/typebox').TUnion<
        [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
      >
    >
    role: import('@sinclair/typebox').TOptional<
      import('@sinclair/typebox').TEnum<{
        readonly ADMIN: 'admin'
        readonly MANAGER: 'manager'
        readonly EMPLOYEE: 'employee'
      }>
    >
  }>
>
export type UserPatch = Static<typeof userPatchSchema>
export declare const userPatchValidator: import('@feathersjs/schema').Validator<any, any>
export declare const userPatchResolver: import('@feathersjs/schema').Resolver<
  {
    role?: 'admin' | 'manager' | 'employee' | undefined
    password?: string | undefined
    store_id?: string | {} | undefined
    username: string
    email: string
    _id: string | {}
  },
  HookContext<UserService<import('./users.class').UserParams>>
>
export declare const userQueryProperties: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    email: import('@sinclair/typebox').TString<'email'>
    username: import('@sinclair/typebox').TString<string>
    password: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TString<string>>
    store_id: import('@sinclair/typebox').TOptional<
      import('@sinclair/typebox').TUnion<
        [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
      >
    >
    role: import('@sinclair/typebox').TOptional<
      import('@sinclair/typebox').TEnum<{
        readonly ADMIN: 'admin'
        readonly MANAGER: 'manager'
        readonly EMPLOYEE: 'employee'
      }>
    >
  }>,
  ['_id', 'email']
>
export declare const userQuerySchema: import('@sinclair/typebox').TIntersect<
  [
    import('@sinclair/typebox').TIntersect<
      [
        import('@sinclair/typebox').TPartial<
          import('@sinclair/typebox').TObject<{
            $limit: import('@sinclair/typebox').TNumber
            $skip: import('@sinclair/typebox').TNumber
            $sort: import('@sinclair/typebox').TObject<{
              email: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
              _id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
            }>
            $select: import('@sinclair/typebox').TUnsafe<('email' | '_id')[]>
            $and: import('@sinclair/typebox').TArray<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TObject<{
                      email: import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<'email'>,
                            import('@sinclair/typebox').TPartial<
                              import('@sinclair/typebox').TIntersect<
                                [
                                  import('@sinclair/typebox').TObject<{
                                    $gt: import('@sinclair/typebox').TString<'email'>
                                    $gte: import('@sinclair/typebox').TString<'email'>
                                    $lt: import('@sinclair/typebox').TString<'email'>
                                    $lte: import('@sinclair/typebox').TString<'email'>
                                    $ne: import('@sinclair/typebox').TString<'email'>
                                    $in:
                                      | import('@sinclair/typebox').TString<'email'>
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TString<'email'>
                                        >
                                    $nin:
                                      | import('@sinclair/typebox').TString<'email'>
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TString<'email'>
                                        >
                                  }>,
                                  import('@sinclair/typebox').TObject<
                                    | {
                                        [key: string]: import('@sinclair/typebox').TSchema
                                      }
                                    | undefined
                                  >
                                ]
                              >
                            >
                          ]
                        >
                      >
                      _id: import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TString<string>,
                                import('@sinclair/typebox').TObject<{}>
                              ]
                            >,
                            import('@sinclair/typebox').TPartial<
                              import('@sinclair/typebox').TIntersect<
                                [
                                  import('@sinclair/typebox').TObject<{
                                    $gt: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $gte: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $lt: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $lte: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $ne: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
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
                                  import('@sinclair/typebox').TObject<
                                    | {
                                        [key: string]: import('@sinclair/typebox').TSchema
                                      }
                                    | undefined
                                  >
                                ]
                              >
                            >
                          ]
                        >
                      >
                    }>
                  >,
                  import('@sinclair/typebox').TObject<{
                    $or: import('@sinclair/typebox').TArray<
                      import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TObject<{
                          email: import('@sinclair/typebox').TOptional<
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TString<'email'>,
                                import('@sinclair/typebox').TPartial<
                                  import('@sinclair/typebox').TIntersect<
                                    [
                                      import('@sinclair/typebox').TObject<{
                                        $gt: import('@sinclair/typebox').TString<'email'>
                                        $gte: import('@sinclair/typebox').TString<'email'>
                                        $lt: import('@sinclair/typebox').TString<'email'>
                                        $lte: import('@sinclair/typebox').TString<'email'>
                                        $ne: import('@sinclair/typebox').TString<'email'>
                                        $in:
                                          | import('@sinclair/typebox').TString<'email'>
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TString<'email'>
                                            >
                                        $nin:
                                          | import('@sinclair/typebox').TString<'email'>
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TString<'email'>
                                            >
                                      }>,
                                      import('@sinclair/typebox').TObject<
                                        | {
                                            [key: string]: import('@sinclair/typebox').TSchema
                                          }
                                        | undefined
                                      >
                                    ]
                                  >
                                >
                              ]
                            >
                          >
                          _id: import('@sinclair/typebox').TOptional<
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >,
                                import('@sinclair/typebox').TPartial<
                                  import('@sinclair/typebox').TIntersect<
                                    [
                                      import('@sinclair/typebox').TObject<{
                                        $gt: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $gte: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $lt: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $lte: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $ne: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
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
                                      import('@sinclair/typebox').TObject<
                                        | {
                                            [key: string]: import('@sinclair/typebox').TSchema
                                          }
                                        | undefined
                                      >
                                    ]
                                  >
                                >
                              ]
                            >
                          >
                        }>
                      >
                    >
                  }>
                ]
              >
            >
            $or: import('@sinclair/typebox').TArray<
              import('@sinclair/typebox').TOptional<
                import('@sinclair/typebox').TObject<{
                  email: import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TUnion<
                      [
                        import('@sinclair/typebox').TString<'email'>,
                        import('@sinclair/typebox').TPartial<
                          import('@sinclair/typebox').TIntersect<
                            [
                              import('@sinclair/typebox').TObject<{
                                $gt: import('@sinclair/typebox').TString<'email'>
                                $gte: import('@sinclair/typebox').TString<'email'>
                                $lt: import('@sinclair/typebox').TString<'email'>
                                $lte: import('@sinclair/typebox').TString<'email'>
                                $ne: import('@sinclair/typebox').TString<'email'>
                                $in:
                                  | import('@sinclair/typebox').TString<'email'>
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TString<'email'>
                                    >
                                $nin:
                                  | import('@sinclair/typebox').TString<'email'>
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TString<'email'>
                                    >
                              }>,
                              import('@sinclair/typebox').TObject<
                                | {
                                    [key: string]: import('@sinclair/typebox').TSchema
                                  }
                                | undefined
                              >
                            ]
                          >
                        >
                      ]
                    >
                  >
                  _id: import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TUnion<
                      [
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TObject<{}>
                          ]
                        >,
                        import('@sinclair/typebox').TPartial<
                          import('@sinclair/typebox').TIntersect<
                            [
                              import('@sinclair/typebox').TObject<{
                                $gt: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $gte: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $lt: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $lte: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $ne: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
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
                              import('@sinclair/typebox').TObject<
                                | {
                                    [key: string]: import('@sinclair/typebox').TSchema
                                  }
                                | undefined
                              >
                            ]
                          >
                        >
                      ]
                    >
                  >
                }>
              >
            >
          }>
        >,
        import('@sinclair/typebox').TOptional<
          import('@sinclair/typebox').TObject<{
            email: import('@sinclair/typebox').TOptional<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TString<'email'>,
                  import('@sinclair/typebox').TPartial<
                    import('@sinclair/typebox').TIntersect<
                      [
                        import('@sinclair/typebox').TObject<{
                          $gt: import('@sinclair/typebox').TString<'email'>
                          $gte: import('@sinclair/typebox').TString<'email'>
                          $lt: import('@sinclair/typebox').TString<'email'>
                          $lte: import('@sinclair/typebox').TString<'email'>
                          $ne: import('@sinclair/typebox').TString<'email'>
                          $in:
                            | import('@sinclair/typebox').TString<'email'>
                            | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TString<'email'>>
                          $nin:
                            | import('@sinclair/typebox').TString<'email'>
                            | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TString<'email'>>
                        }>,
                        import('@sinclair/typebox').TObject<
                          | {
                              [key: string]: import('@sinclair/typebox').TSchema
                            }
                          | undefined
                        >
                      ]
                    >
                  >
                ]
              >
            >
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
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $gte: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $lt: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $lte: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $ne: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
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
                        import('@sinclair/typebox').TObject<
                          | {
                              [key: string]: import('@sinclair/typebox').TSchema
                            }
                          | undefined
                        >
                      ]
                    >
                  >
                ]
              >
            >
          }>
        >
      ]
    >,
    import('@sinclair/typebox').TObject<{}>
  ]
>
export type UserQuery = Static<typeof userQuerySchema>
export declare const userQueryValidator: import('@feathersjs/schema').Validator<any, any>
export declare const userQueryResolver: import('@feathersjs/schema').Resolver<
  Partial<{
    $limit: number
    $skip: number
    $sort: {
      email?: number | undefined
      _id?: number | undefined
    }
    $select: ('email' | '_id')[]
    $and: (
      | {
          email?:
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
                } & {}
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
                } & {}
              >
            | undefined
        }
      | {
          $or: {
            email?:
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
                  } & {}
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
                  } & {}
                >
              | undefined
          }[]
        }
    )[]
    $or: {
      email?:
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
            } & {}
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
            } & {}
          >
        | undefined
    }[]
  }> & {
    email?:
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
          } & {}
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
          } & {}
        >
      | undefined
  } & {},
  HookContext<UserService<import('./users.class').UserParams>>
>
