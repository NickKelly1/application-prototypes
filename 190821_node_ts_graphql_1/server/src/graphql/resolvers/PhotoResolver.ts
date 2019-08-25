import { PhotoResolvers } from '../generated/graphql.generated';
import { PhotoEntity } from '../../entities/PhotoEntity';
import { UserEntity } from '../../entities/UserEntity';

export const PhotoResolver: PhotoResolvers = {
  user: async (parent, args, ctx) => {
    const user = await parent.getUser();
    return user;
  }
}