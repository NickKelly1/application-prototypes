import { Resolvers } from "../graphql/generated/graphql.generated";
import { Query } from "../graphql/Query";
import { Mutation } from "../graphql/Mutation";
import { UserResolver } from "../graphql/resolvers/UserResolver";
import { ProfileResolver } from "../graphql/resolvers/ProfileResolver";
import { PhotoResolver } from "../graphql/resolvers/PhotoResolver";

export const resolvers: Resolvers = {
  Query: Query,
  Mutation: Mutation,
  User: UserResolver,
  Profile: ProfileResolver,
  Photo: PhotoResolver,
};
