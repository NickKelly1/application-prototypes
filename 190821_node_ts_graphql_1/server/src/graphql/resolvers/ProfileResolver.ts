import { ProfileResolvers } from '../generated/graphql.generated';
import { ProfileEntity } from '../../entities/ProfileEntity';

export const ProfileResolver: ProfileResolvers = {
  user: async (parent, args, ctx) => {
    const user = parent.getUser();
    return user;
  }
}