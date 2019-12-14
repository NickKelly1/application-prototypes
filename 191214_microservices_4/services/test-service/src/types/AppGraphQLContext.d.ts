import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppGraphQLContext extends ExpressContext {
  // extend the graphql context type
}
