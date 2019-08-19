import { paginateResults } from './utils';
import { DataSources } from './app';
import { hasProperty, hasNumberProperty, isNumber } from './helpers/type-guards';

/**
 * Resolver type:
 * fieldName: (parent, args, context, info) => data;
 *
 * parent:
 *  - An object that contains the result returned from the resolver on the parent type
 *
 * args:
 *  - An object that contains the arguments passed to the field
 *
 * context:
 *  - An object shared by all resolvers in a GraphQL operation. We use the context
 *    to contain per-request state such as authentication information and access our data sources.
 *
 * info:
 *  - Information about the execution state of the operation which should only be used in advanced cases
 */
export const resolvers = {
  Query: {
    /**
     * @param parent empty because we're at the graph's root
     */
    launches: async (
      parent: any,
      { pageSize = 20, after }: { pageSize?: number; after?: string },
      { dataSources }: { dataSources: DataSources },
    ) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // reverse for chronological order
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },

    launch: (parent: any, { id }: any, { dataSources }: { dataSources: DataSources }) => {
      return dataSources.launchAPI.getLaunchById({ launchId: id });
    },

    me: (parent: any, args: any, { dataSources }: { dataSources: DataSources }) => {
      return dataSources.userApi.findOrCreateUser();
    },
  },

  // types:

  Mission: {
    // make sure the default size is 'large' in case the user doesn't
    missionPatch: (
      mission: { missionPatchSmall: unknown } | { missionPatchLarge: unknown },
      { size }: { size: 'SMALL' | 'LARGE' } = { size: 'LARGE' },
    ) => {
      if (size === 'SMALL') {
        if (!hasProperty(mission, 'missionPatchSmall')) throw new ReferenceError('Invalid state - no missionPatchSmall');
        return mission.missionPatchSmall;
      }

      if (!hasProperty(mission, 'missionPatchLarge')) throw new ReferenceError('Invalid state - no missionPatchLarge');
      return mission.missionPatchLarge;
    },
  },

  Launch: {
    isBooked: async (launch: { id: number }, _: unknown, { dataSources }: { dataSources: DataSources }) => {
      return dataSources.userApi.isBookedOnLaunch({ launchId: launch.id });
    },
  },

  User: {
    trips: async (_: unknown, __: unknown, { dataSources }: { dataSources: DataSources }) => {
      // get ids of launches by user
      const launchIds = await dataSources.userApi.getLaunchIdsByUser();

      if (!launchIds) return [];

      // look up those launches by their ids
      return dataSources.launchAPI.getLaunchesByIds({ launchIds }) || [];
    },
  },

  // mutations:

  Mutation: {
    login: async (_: unknown, { email: emailArg }: { email?: string }, { dataSources }: { dataSources: DataSources }) => {
      const email = emailArg || '';
      const user = await dataSources.userApi.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString('base64');
    },

    bookTrips: async (
      _: unknown,
      { launchIds: launchIdsArg }: { launchIds?: number[] },
      { dataSources }: { dataSources: DataSources },
    ) => {
      const launchIds: number[] = launchIdsArg || [];
      const results = (await dataSources.userApi.bookTrips({ launchIds })) || [];
      const launches = await dataSources.launchAPI.getLaunchesByIds({ launchIds });

      return {
        success: results && results.length === launchIds.length,
        message:
          results && results.length === launchIds.length
            ? 'trips booked successfully'
            : `the following launches couldn't be booked: ${launchIds.filter(
                id => results.findIndex(r => r.id === id) !== -1,
              )}`,
      };
    },

    cancelTrip: async (_: unknown, { launchId }: { launchId?: number }, { dataSources }: { dataSources: DataSources }) => {
      if (!isNumber(launchId)) throw new ReferenceError('Invalid state: no number launchId');

      const result = await dataSources.userApi.cancelTrip({ launchId });
      if (!result) return { success: false, message: 'failed to cancel trip' };

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return { success: true, message: 'trip cancelled', launches: [launch] };
    },
  },
};
