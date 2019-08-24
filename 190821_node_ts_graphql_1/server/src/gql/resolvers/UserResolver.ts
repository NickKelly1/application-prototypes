import { UserResolvers } from '../generated/graphqlgen';

export const UserResolver: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  profile: (parent, args, ctx) => {
    const { profile } = parent;
    return profile;
  },
  photos: (parent, args, ctx) => {
    // const {  } = parent;
    return parent.photos;
  }
}