import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga'
import { logger } from './helpers/logger';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import { Either, left } from './helpers/either';
import { env } from '../env';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


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

// // read from ormconfig before starting server
createConnection().then(() => {
  server.start(() => logger('app::Server is running on localhost:4000'))
});

console.log('its not working --- 0123');
