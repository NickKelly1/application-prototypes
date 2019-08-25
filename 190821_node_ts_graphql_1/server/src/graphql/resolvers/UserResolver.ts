import { UserResolvers } from '../generated/graphql.generated';
import { UserEntity } from '../../entities/UserEntity';
import { ProfileEntity } from '../../entities/ProfileEntity';
import { PhotoEntity } from '../../entities/PhotoEntity';

export const UserResolver: UserResolvers = {
  /**
   * Profle
   */
  profile: async (parent, args, ctx) => {
    const profile = await parent.getProfile();
    return profile || null;
  },

  /**
   * Photos
   */
  photos: async (parent, args, ctx) => {
    const photos = await parent.getPhotos();
    return photos || null;
  }
}