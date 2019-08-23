import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga'
import { logger } from './helpers/logger';
import { createConnection } from 'typeorm';


const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`

const resolvers = {
  Query: {
    hello: (_: any , { name }: any) => `Hello ${name || 'World'}`,
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

// read from ormconfig before starting server
createConnection().then(() => {
  server.start(() => logger('app::Server is running on localhost:4000'))
});
