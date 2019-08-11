import { gql } from 'apollo-server';

/**
 * cheat-sheet          @see https://devhints.io/graphql#schema
 * queries              @see https://graphql.org/learn/queries/
 * serving over http    @see https://graphql.org/learn/serving-over-http/
 *
 * the comments between """ """ are called "docstrings"
 */
export const typeDefs = gql`
  type Query {
    # old launches:
    # launches: [Launch]!
    # new launches:
    launches(
      """
      The number of results to show must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): LaunchConnection!

    launch(id: ID!): Launch

    # Queries for the current user
    me: User
  }

  """
  Simple wrapper around our list of launches that contain a cursor to the last item in the list
  Pass this cursor to the launches query to fetch results after these
  """
  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
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
    cursor: String
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
