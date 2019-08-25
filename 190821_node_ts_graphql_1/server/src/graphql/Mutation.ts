import { UserEntity } from '../entities/UserEntity';
import { MutationResolvers } from './generated/graphql.generated';
import { ProfileEntity } from '../entities/ProfileEntity';
import { PhotoEntity } from '../entities/PhotoEntity';
import { copyWithout } from '../helpers/copy-without';
import { $TS_FIX_ME, PropertiesExceptWhere, KeysExceptWhere } from '../helpers/helper-types';

export const Mutation: MutationResolvers = {
  createUser: async (parent, args) => {
    const profile = args.profile
      ? ProfileEntity.create({ ...args.profile })
      : undefined;

    const photos = args.photos
      ? args.photos.map(photoArg => PhotoEntity.create({ ...photoArg }))
      : undefined;

    const user = await UserEntity.create({
      ...args.user,
      profile: profile,
      photos: photos,
    });

    await user.save();
    await user.reload();

    return user;
  },
  updateUser: async (parent, args) => {
    const { id, ...userArgs } = args.user;
    await UserEntity.update(args.user.id, userArgs);
    const user = await UserEntity.findOneOrFail(id);
    return user;
  },
  deleteUser: async (parent, args) => {
    const result = await UserEntity.delete(args.user.id);
    return !!result.affected;
  },

  createProfile: async (parent, args) => {
    const profile = await ProfileEntity.create({...args.profile}).save();
    return profile;
  },

  updateProfile: async (parent, args) => {
    const { id, ...profileArgs } = args.profile;
    await ProfileEntity.update(args.profile.id, profileArgs);
    const profile = await ProfileEntity.findOneOrFail(id);
    return profile;
  },

  deleteProfile: async (parent, args) => {
    const result = await ProfileEntity.delete(args.profile.id);
    return !!result.affected;
  },

  createPhoto: async (parent, args) => {
    const photo = await PhotoEntity.create({...args.photo}).save();
    return photo;
  },

  updatePhoto: async (parent, args) => {
    const { id, ...photoArgs } = args.photo;
    await PhotoEntity.update(args.photo.id, photoArgs);
    const photo = await PhotoEntity.findOneOrFail(id);
    return photo;
  },

  deletePhoto: async (parent, args) => {
    const result = await PhotoEntity.delete(args.photo.id);
    return !!result.affected;
  },

}