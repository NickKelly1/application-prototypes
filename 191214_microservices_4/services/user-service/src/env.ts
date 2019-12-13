import dotenv from 'dotenv';

// load .env into environment variables
dotenv.config();

/**
 * @description
 * Read environment variables from the process
 */
const readEnv = () => ({
  NODE_ENV: process.env.NODE_ENV,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  USER_SERVICE_ADMIN_USERNAME: process.env.USER_SERVICE_ADMIN_USERNAME,
  USER_SERVICE_ADMIN_PASSWORD: process.env.USER_SERVICE_ADMIN_PASSWORD,

  USER_SERVICE_INTERNAL_PORT: Number(process.env.USER_SERVICE_INTERNAL_PORT),

  USER_SERVICE_MONGODB_HOST: process.env.USER_SERVICE_MONGODB_HOST,
  USER_SERVICE_MONGODB_PORT: process.env.USER_SERVICE_MONGODB_PORT,

  USER_SERVICE_MONGODB_USER: process.env.USER_SERVICE_MONGODB_USER,
  USER_SERVICE_MONGODB_PASSWORD: process.env.USER_SERVICE_MONGODB_PASSWORD,

  JWT: process.env.JWT,

  SLEEP: (process.env.SLEEP as any) === 'true'
    ? true : (process.env.SLEEP as any) === 'false'
      ? false : process.env.SLEEP,

  // aggregated
  USER_SERVICE_MONGODB_URI: `mongodb://${process.env.USER_SERVICE_MONGODB_HOST}:${process.env.USER_SERVICE_MONGODB_PORT}`,

  ROOT_DIR: process.env.ROOT_DIR,
  EXT_NAME: process.env.EXT_NAME,
});



// default to environment variables from the process
export const env = readEnv();



// validate environment variables exist
Object.entries(env).forEach(([k, v]) => {
  if (env.NODE_ENV !== 'production') console.log(`[env] Setting ${k} "${v}"`);

  if (v === undefined) throw new TypeError(`Missing env variable: "${k}"`);
  if (typeof v === 'number' && !Number.isFinite(v)) throw new Error(`Missing / invalid env variable: "${k}" - "${v}"`);
});
