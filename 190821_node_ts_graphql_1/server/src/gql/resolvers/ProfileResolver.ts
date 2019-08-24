import { ProfileResolvers } from '../generated/graphqlgen';

export const ProfileResolver: ProfileResolvers.Type = {
  ...ProfileResolvers.defaultResolvers,

  user: (parent, args, ctx) => {
    throw new Error('Resolver not implemented');
  }
}