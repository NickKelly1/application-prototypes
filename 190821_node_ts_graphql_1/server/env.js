// @note: this is .js file to be used on startup with ormconfig

/**
 * @description
 * Server environment variables
 *
 * @note: keep in sync with environment.d.ts
 */
const env = {
  NODE_SERVER_CONTAINER_NAME: process.env.NODE_SERVER_CONTAINER_NAME,
  NODE_SERVER_PORT: Number(process.env.NODE_SERVER_PORT),
  NODE_SERVER_INTERNAL_PORT: Number(process.env.NODE_SERVER_INTERNAL_PORT),
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
};

module.exports.env = env;

Object.entries(env).forEach(([k, v]) => {
  if (v === undefined) throw new TypeError(`Missing env variable: "${k}"`);
  if (typeof v === 'number' && !Number.isFinite(v)) throw new Error(`Missing / invalid env variable: "${k}" - "${v}"`);
});
