import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga'
import { logger, L_C } from './helpers/logger';
import { createConnection, getConnection } from 'typeorm';
import { env } from '../env';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { resolvers } from './graphql/resolvers';
import { IResolvers } from 'graphql-middleware/dist/types';

// dataContext is the talks replacement for a database
const dataContext = {};

const server = new GraphQLServer({
  typeDefs: './src/graphql/schema.graphql',
  resolvers: resolvers as IResolvers,
  context: { data: dataContext },
})

const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB_NAME,
  synchronize: true,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  cli: {
    'entitiesDir': 'src/entities',
    'migrationsDir': 'src/migrations',
    'subscribersDir': 'src/subscribers'
  }
}

createConnection(dbConfig).then(() => {
  server.start(({ port }: any) => logger(`app::Server is running on localhost:${port}`))
});
