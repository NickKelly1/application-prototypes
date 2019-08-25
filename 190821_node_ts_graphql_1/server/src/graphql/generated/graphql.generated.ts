import { GraphQLResolveInfo } from 'graphql';
import { UserEntity } from '../../entities/UserEntity';
import { ProfileEntity } from '../../entities/ProfileEntity';
import { PhotoEntity } from '../../entities/PhotoEntity';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type CreatePhotoInput = {
  url: Scalars['String'],
};

export type CreateProfileInput = {
  favouriteColour: Scalars['String'],
};

export type CreateUserInput = {
  email: Scalars['String'],
};

export type DeletePhotoInput = {
  id: Scalars['Int'],
};

export type DeleteProfileInput = {
  id: Scalars['Int'],
};

export type DeleteUserInput = {
  id: Scalars['Int'],
};

export type Mutation = {
  __typename?: 'Mutation',
  createUser: User,
  updateUser: User,
  deleteUser?: Maybe<Scalars['Boolean']>,
  createProfile: Profile,
  updateProfile: Profile,
  deleteProfile?: Maybe<Scalars['Boolean']>,
  createPhoto: Photo,
  updatePhoto: Photo,
  deletePhoto?: Maybe<Scalars['Boolean']>,
};


export type MutationCreateUserArgs = {
  user: CreateUserInput,
  profile?: Maybe<CreateProfileInput>,
  photos?: Maybe<Array<CreatePhotoInput>>
};


export type MutationUpdateUserArgs = {
  user: UpdateUserInput
};


export type MutationDeleteUserArgs = {
  user: DeleteUserInput
};


export type MutationCreateProfileArgs = {
  profile: CreateProfileInput
};


export type MutationUpdateProfileArgs = {
  profile: UpdateProfileInput
};


export type MutationDeleteProfileArgs = {
  profile: DeleteProfileInput
};


export type MutationCreatePhotoArgs = {
  photo: CreatePhotoInput
};


export type MutationUpdatePhotoArgs = {
  photo: UpdatePhotoInput
};


export type MutationDeletePhotoArgs = {
  photo: DeletePhotoInput
};

export type Photo = {
  __typename?: 'Photo',
  id: Scalars['Int'],
  url: Scalars['String'],
  userId: Scalars['Int'],
  user: User,
};

export type Profile = {
  __typename?: 'Profile',
  id: Scalars['Int'],
  favouriteColour: Scalars['String'],
  userId: Scalars['Int'],
  user: User,
};

export type Query = {
  __typename?: 'Query',
  user: User,
  users: Array<Maybe<User>>,
  profile: Profile,
  photo: Photo,
};


export type QueryUserArgs = {
  id: Scalars['Int']
};


export type QueryProfileArgs = {
  id: Scalars['Int']
};


export type QueryPhotoArgs = {
  id: Scalars['Int']
};

export type UpdatePhotoInput = {
  id: Scalars['Int'],
  url: Scalars['String'],
};

export type UpdateProfileInput = {
  id: Scalars['Int'],
  favouriteColour: Scalars['String'],
};

export type UpdateUserInput = {
  id: Scalars['Int'],
  email: Scalars['String'],
};

export type User = {
  __typename?: 'User',
  id: Scalars['Int'],
  email: Scalars['String'],
  profile?: Maybe<Profile>,
  photos?: Maybe<Array<Photo>>,
};
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  User: ResolverTypeWrapper<UserEntity>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Profile: ResolverTypeWrapper<ProfileEntity>,
  Photo: ResolverTypeWrapper<PhotoEntity>,
  Mutation: ResolverTypeWrapper<{}>,
  CreateUserInput: CreateUserInput,
  CreateProfileInput: CreateProfileInput,
  CreatePhotoInput: CreatePhotoInput,
  UpdateUserInput: UpdateUserInput,
  DeleteUserInput: DeleteUserInput,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  UpdateProfileInput: UpdateProfileInput,
  DeleteProfileInput: DeleteProfileInput,
  UpdatePhotoInput: UpdatePhotoInput,
  DeletePhotoInput: DeletePhotoInput,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  Int: Scalars['Int'],
  User: UserEntity,
  String: Scalars['String'],
  Profile: ProfileEntity,
  Photo: PhotoEntity,
  Mutation: {},
  CreateUserInput: CreateUserInput,
  CreateProfileInput: CreateProfileInput,
  CreatePhotoInput: CreatePhotoInput,
  UpdateUserInput: UpdateUserInput,
  DeleteUserInput: DeleteUserInput,
  Boolean: Scalars['Boolean'],
  UpdateProfileInput: UpdateProfileInput,
  DeleteProfileInput: DeleteProfileInput,
  UpdatePhotoInput: UpdatePhotoInput,
  DeletePhotoInput: DeletePhotoInput,
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>,
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'user'>>,
  deleteUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'user'>>,
  createProfile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType, RequireFields<MutationCreateProfileArgs, 'profile'>>,
  updateProfile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'profile'>>,
  deleteProfile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProfileArgs, 'profile'>>,
  createPhoto?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<MutationCreatePhotoArgs, 'photo'>>,
  updatePhoto?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<MutationUpdatePhotoArgs, 'photo'>>,
  deletePhoto?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeletePhotoArgs, 'photo'>>,
}>;

export type PhotoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Photo'] = ResolversParentTypes['Photo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
}>;

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  favouriteColour?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>,
  users?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>,
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType, RequireFields<QueryProfileArgs, 'id'>>,
  photo?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<QueryPhotoArgs, 'id'>>,
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>,
  photos?: Resolver<Maybe<Array<ResolversTypes['Photo']>>, ParentType, ContextType>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>,
  Photo?: PhotoResolvers<ContextType>,
  Profile?: ProfileResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
