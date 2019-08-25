import { QueryResolvers } from './generated/graphql.generated';
import { UserEntity } from '../entities/UserEntity';

export const Query: QueryResolvers = {
  user: async (parent, args, ctx) => {
    const user = await UserEntity.findOne({ id: args.id });
    if (!user) throw new Error('TODO: handle user not found');
    return user;
  },

  users: async (parent, args, ctx) => {
    const users = await UserEntity.find();
    return users;
  }
}
