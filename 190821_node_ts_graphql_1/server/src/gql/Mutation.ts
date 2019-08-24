import { MutationResolvers } from './generated/graphqlgen';
import { UserEntity } from '../entities/UserEntity';

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  createUser: async (parent, args) => {
    const { user: userArg } = args;
    const { email, profile, photos } = userArg;

    const user = await UserEntity.create({
      email,
      profile: (profile || undefined),
      photos: (photos || undefined)
    }).save();

    return { entity: user };
  },
  updateUser: (parent, args, ctx) => {
    throw new Error('Resolver not implemented');
  },
  deleteUser: (parent, args, ctx) => {
    throw new Error('Resolver not implemented');
  }
}