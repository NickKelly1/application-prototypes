// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

// @note: this is .js file to be used on startup with ormconfig

const readEnv = () => ({
  NODE_SERVER_INTERNAL_PORT: Number(process.env.NODE_SERVER_INTERNAL_PORT),
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
});

let env = readEnv();

/**
 * @description
 * Server environment variables
 *
 * @note: keep in sync with environment.d.ts
 */

if (Object.values(env).every(v => v === undefined)) {
  console.log('__READING ENVIRONMENT VARIABLES FROM__ .env __');
  dotenv.config();
  env = readEnv();
} else {
  console.log('__READING ENVIRONMENT VARIABLES FROM__ environment __');
}

module.exports.env = env;

Object.entries(env).forEach(([k, v]) => {
  if (v === undefined) throw new TypeError(`Missing env variable: "${k}"`);
  if (typeof v === 'number' && !Number.isFinite(v)) throw new Error(`Missing / invalid env variable: "${k}" - "${v}"`);
});

console.log('ENVIRONMENT VARIABLES:', env);
