import type { Params } from '@feathersjs/feathers';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '../../declarations';
import type { User, UserData, UserPatch, UserQuery } from './users.schema';
export type { User, UserData, UserPatch, UserQuery };
export interface UserParams extends MongoDBAdapterParams<UserQuery> {
}
export declare class UserService<ServiceParams extends Params = UserParams> extends MongoDBService<User, UserData, UserParams, UserPatch> {
}
export declare const getOptions: (app: Application) => MongoDBAdapterOptions;
