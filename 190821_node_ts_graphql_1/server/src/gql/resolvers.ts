import { PhotoResolver } from './resolvers/PhotoResolver';
import { UserResolver } from './resolvers/UserResolver';
import { ProfileResolver } from './resolvers/ProfileResolver';
import { Query } from './Query';
import { Mutation } from './Mutation';
import { Resolvers } from './generated/graphqlgen';

export const resolvers: Resolvers = {
  Query: Query,
  Mutation: Mutation,
  User: UserResolver,
  Profile: ProfileResolver,
  Photo: PhotoResolver,
};
