import { gql } from 'apollo-server';

/**
 * cheat-sheet          @see https://devhints.io/graphql#schema
 * queries              @see https://graphql.org/learn/queries/
 * serving over http    @see https://graphql.org/learn/serving-over-http/
 */
export const typeDefs = gql`
  type Query {
    launches: [Launch]!
    launch(id: ID!): Launch

    # Queries for the current user
    me: User
  }

  type Mutation {
    # false -> booking trips failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    # false -> cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): String # login token
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;
