import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga'
import { logger, L_C } from './helpers/logger';
import { createConnection, getConnection } from 'typeorm';
import { env } from '../env';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from './entities/User';
import { ResolverMap } from './types/ResolverType';
import { Profile } from './entities/Profile';
import { Photo } from './entities/Photo';


const typeDefs = `
  type User {
    id: Int!
    email: String!
    firstName: String!
    profileId: Int
    profile: Profile
    photos: [Photo],
  }

  type Profile {
    id: Int!
    favouriteColour: String!
  }

  input ProfileInput {
    favouriteColour: String!
  }

  type Photo {
    url: String!,
    userId: Int,
    user: User,
  }

  input PhotoInput {
    url: String!,
  }

  type Query {
    hello(name: String): String!
    user(id: Int!): User!
    users: [User!]!
    photo(id: Int!): Photo!
    profile(id: Int!): Profile!
  }

  type Mutation {
    createUser(firstName: String!, email: String!, profile: ProfileInput, photos: [PhotoInput]): User!
    updateUser(id: Int!, firstName: String, email: String): Boolean
    deleteUser(id: Int!): Boolean
  }
`;

const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,

    /**
     * @description
     * User Query Resolver
     */
    user: async (parent, { id }) => {
      const user = await User.findOne(id, { relations: ['profile', 'photos'] });
      logger(`resolvers::Query::user(${id})`, { i: '🧔', c: L_C.SPRING_GREEN, v: user });
      return user;
    },

    /**
     * @description
     * Users Query Resolver
     */
    users: () => {
      const users = User.find({ relations: ['profile', 'photos'] });
      logger('resolvers::Query::users', { i: '🧔🧔🧔', c: L_C.SPRING_GREEN, v: users });
      return users;
    },

    /**
     * @description
     * Photos resolver
     */
    profile: async (parent, { id }) => {
      const profile = await Photo.findOne(id, { relations: ['user'], } );
      logger(`resolvers::Query::profile(${id})`, { i: '🖼', c: L_C.SPRING_GREEN, v: profile });
      return profile;
    },

    /**
     * @description
     * Photo resolver
     */
    photo: async (parent, { id }) => {
      const photo = await Photo.findOne(id, { relations: ['user'], } );
      logger(`resolvers::Query::photo(${id})`, { i: '📷', c: L_C.SPRING_GREEN, v: photo });
      return photo
    },
  },

  Mutation: {
    createUser: async (_, { firstName, email, profile: profileArg, photos: photosArg }) => {
      const profile = Profile.create({...profileArg});
      const photos = (photosArg || []).map((photoArg: any) => Photo.create({...photoArg}));
      const user = await User.create({ firstName, email, profile, photos }).save();
      return user;
    },

    updateUser: (_, { id, ...args }) => {
      try {
        User.update(id, args);
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },

    deleteUser: async (_, { id }) => {
      try {
        const user = await User.findOne(id);
        if (user) user.remove();

        // alternatively

        // const deleteQuery = getConnection()
        //   .createQueryBuilder()
        //   .delete()
        //   .from(User)
        //   .where('id = :id and email = :email', { id, email: 'bob@bob.com' })

        // if (id === 5) {
        //   deleteQuery.andWhere('firstName = :firstName', { firstName: 'jimmy' });
        // }

        // await deleteQuery.execute();

      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })

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
  server.start(({ port }) => logger(`app::Server is running on localhost:${port}`))
});
