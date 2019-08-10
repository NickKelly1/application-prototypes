import { Sequelize, Op, INTEGER, DATE, STRING, Model } from 'sequelize';

export function paginateResults({
  after: afterCursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}: {
  after: unknown;
  pageSize: number;
  results: { cursor?: unknown }[];
  getCursor: Function;
}) {
  //
  if (pageSize < 1) return [];

  if (!afterCursor) return results.slice(0, pageSize);

  const cursorIndex = results.findIndex(item => {
    let itemCursor = item.cursor ? item.cursor : getCursor(item);
    return itemCursor ? afterCursor === itemCursor : false;
  });

  if (cursorIndex <= 0) return results.slice(0, pageSize);
  // don't allow overflow
  if (cursorIndex >= results.length - 1) return [];
  return results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize));
}

export function createStore() {
  const operatorsAliases = { $in: Op.in };

  const db = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: true,
  });

  // https://vivacitylabs.com/setup-typescript-sequelize/
  // https://michalzalecki.com/using-sequelize-with-typescript/
  // https://sequelize.org/master/manual/typescript.html

  // https://sequelize.org/master/manual/typescript.html
  // TypeScript doesn't know how to generate a class definition when we use the sequelize.define
  // method to define a Model. Therefore, we need to do some manual work and declare an interface
  // and a type, and eventually cast the result of .define to the static type.
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
  });

  // users.findOrCreate({});

  interface Z {
    a: 'hi';
  }

  const trips = db.define('trip', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DATE,
    updatedAt: DATE,
    email: STRING,
    token: STRING,
  });

  return { users, trips };
}

export type Store = ReturnType<typeof createStore>;
