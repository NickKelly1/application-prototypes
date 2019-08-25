import { PhotoResolver } from './resolvers/PhotoResolver';
import { UserResolver } from './resolvers/UserResolver';
import { ProfileResolver } from './resolvers/ProfileResolver';
import { Query } from './Query';
import { Mutation } from './Mutation';
import { Resolvers } from './generated/graphql.generated';

interface EntityResolvers {
  Mutation?: Resolvers['Mutation'];
  Photo?: typeof PhotoResolver;
  Profile?: typeof ProfileResolver;
  Query?: Resolvers['Query'];
  User?: typeof UserResolver;
}

export const resolvers: EntityResolvers = {
  Query: Query,
  Mutation: Mutation,
  User: UserResolver,
  Profile: ProfileResolver,
  Photo: PhotoResolver,
};
