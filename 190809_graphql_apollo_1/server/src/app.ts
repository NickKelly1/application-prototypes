import { ApolloServer, gql } from 'apollo-server';
import { validate as validateEmail } from 'isemail';
import { typeDefs } from './schema';
import { createStore, Store } from './utils';
import { LaunchAPI } from './datasources/launch';
import { UserAPI } from './datasources/user';
import { resolvers } from './resolvers';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

const store = createStore();

// https://www.apollographql.com/docs/tutorial/resolvers/

const getDataSources = (s: Store) => ({ launchAPI: new LaunchAPI(), userApi: new UserAPI({ store: s }) });

export type DataSources = ReturnType<typeof getDataSources>;

const server = new ApolloServer({
  context: async ({ req }: { req: ExpressContext['req'] }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    // if the email isn't formatted validly, return null for user
    if (!validateEmail(email)) return { user: null };
    // find a user by their email
    const [user] = await store.users.findOrCreate({ where: { email } });

    return { user: { ...user.get() } };
  },
  typeDefs,
  resolvers: resolvers,
  dataSources: () => getDataSources(store),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
