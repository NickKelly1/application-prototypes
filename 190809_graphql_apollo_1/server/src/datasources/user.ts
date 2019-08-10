import { DataSource, DataSourceConfig } from 'apollo-datasource';
import isEmail from 'isemail';
import sequelize, { Model } from 'sequelize';
import { Store } from '../utils';
import { isString } from '../helpers/type-guards';

class UserAPI<T extends { user: Record<PropertyKey, unknown> } = any, S extends Store = Store> extends DataSource<T> {
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

    const u = this.store.users;
    const y = u.findOrCreate({ where: { email } });
    const users = await this.store.users.findOrCreate; //.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  };

  public async bookTrips({ launchIds }) {
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

  public async bookTrip({ launchId }) {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  public async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  public async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId },
    });
    return found && found.length ? found.map(l => l.dataValues.launchId).filter(l => !!l) : [];
  }

  public async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;
