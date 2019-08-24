import { PhotoResolvers } from '../generated/graphqlgen';

export const PhotoResolver: PhotoResolvers.Type = {
  ...PhotoResolvers.defaultResolvers,

  user: (parent, args, ctx) => {
    throw new Error('Resolver not implemented');
  }
}