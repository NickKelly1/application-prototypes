import { Sequelize, Op, INTEGER, DATE, STRING, Model } from 'sequelize';
import { BuildOptions } from 'sequelize';

export function paginateResults<T extends { cursor?: string }>({
  after: targetCursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}: {
  after?: string;
  pageSize: number;
  results: T[];
  getCursor?: (item: Record<string, unknown>) => null | string;
}) {
  //
  if (pageSize < 1) return [];

  if (!targetCursor) return results.slice(0, pageSize);

  const cursorIndex = results.findIndex(item => {
    let currentCursor = item.cursor ? item.cursor : getCursor(item);
    if (!currentCursor) return false;
    return targetCursor === currentCursor;
  });

  if (cursorIndex <= 0) return results.slice(0, pageSize);
  // don't allow overflow
  if (cursorIndex >= results.length - 1) return [];
  return results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize));
}

// We need to declare an interface for our model that is basically what our class would be
export interface UserModel extends Model {
  readonly id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  token: string;
}

export interface TripsModel extends Model {
  readonly id: number;
  createdAt: Date;
  updatedAt: Date;
  launchId: number;
  userId: UserModel['id'];
}

export function createStore() {
  const operatorsAliases = { $in: Op.in };

  const db = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: console.log,
  });

  // https://sequelize.org/master/manual/typescript.html
  // TypeScript doesn't know how to generate a class definition when we use the sequelize.define
  // method to define a Model. Therefore, we need to do some manual work and declare an interface
  // and a type, and eventually cast the result of .define to the static type.

  // TS can't derive a proper class definition from a `.define` call, therefore we need to cast here

  /**
   * --------------------------------------
   * User Model
   * --------------------------------------
   */

  // Need to declare the static model so `findOne` etc. use correct types.
  type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserModel;
  };

  const users = db.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DATE,
    updatedAt: DATE,
    email: STRING,
    token: STRING,
  }) as UserModelStatic;

  /**
   * --------------------------------------
   * Trips Model
   * --------------------------------------
   */

  type TripsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): TripsModel;
  };

  const trips = db.define('trip', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DATE,
    updatedAt: DATE,
    launchId: INTEGER,
    userId: INTEGER,
  }) as TripsModelStatic;

  return { users, trips };
}

export type Store = ReturnType<typeof createStore>;
