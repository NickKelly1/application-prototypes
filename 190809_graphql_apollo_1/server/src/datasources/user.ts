import { DataSource, DataSourceConfig } from 'apollo-datasource';
import isEmail from 'isemail';
import sequelize, { Model } from 'sequelize';
import { Store } from '../utils';
import { isString, isNumber, hasNumberProperty } from '../helpers/type-guards';

/**
 * @see https://www.apollographql.com/docs/tutorial/data-source/
 * The initialize method: You'll need to implement this method if you
 * want to pass in any configuration options to your class. Here, we're
 * using this method to access our graph API's context.
 *
 * this.context: A graph API's context is an object that's shared among
 * every resolver in a GraphQL request. We're going to explain this in
 * more detail in the next section. Right now, all you need to know is
 * that the context is useful for storing user information.
 */
export class UserAPI<
  T extends { user: { id: number } & Record<PropertyKey, unknown> } = any,
  S extends Store = Store
> extends DataSource<T> {
  private store: S;
  private context?: T;

  public constructor({ store }: { store: S }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public initialize = (config: DataSourceConfig<T>) => {
    this.context = config.context;
  };

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  public findOrCreateUser = async ({ email: emailArg }: { email?: string } = {}) => {
    const email = this.context && this.context.user ? this.context.user.email : emailArg;

    // Either<left, right>
    if (!email || !isString(email) || !isEmail.validate(email)) return null;

    const [user] = await this.store.users.findOrCreate({ where: { email } });
    return user;
  };

  public async bookTrips({ launchIds }: { launchIds: number[] }) {
    if (!this.context) throw ReferenceError('invalid state');
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  public async bookTrip({ launchId }: { launchId: number }) {
    if (!this.context) throw new ReferenceError('invalid state');
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({ where: { userId, launchId } });

    // fail
    if (!res || !res.length) return false;

    const attributes = res[0].get();
    // invalid
    if (!hasNumberProperty(attributes, 'id')) throw new ReferenceError('Invalid state: no "id" on trip attributes');
    // success
    return attributes;
  }

  public async cancelTrip({ launchId }: { launchId: number }) {
    if (!this.context) throw new ReferenceError('invalid state');
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  public async getLaunchIdsByUser() {
    if (!this.context) throw new ReferenceError('invalid state');
    const userId = this.context.user.id;
    const foundTrips = await this.store.trips.findAll({ where: { userId } });
    // return trips that have launch ids
    return foundTrips && foundTrips.length
      ? foundTrips.map(trip => trip.getDataValue('launchId')).filter(trip => !!trip)
      : [];
  }

  /**
   * @description
   * Determine if the user is booked on the given launch
   *
   * @param param0
   */
  public async isBookedOnLaunch({ launchId }: { launchId: number }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({ where: { userId, launchId } });
    return found && found.length > 0;
  }
}
