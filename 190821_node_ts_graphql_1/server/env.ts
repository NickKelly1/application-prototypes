import dotenv from 'dotenv';
import { logger, L_C } from './src/helpers/logger';

/**
 * @description
 * Read environment variables from the process
 */
const readEnv = () => ({
  NODE_SERVER_INTERNAL_PORT: Number(process.env.NODE_SERVER_INTERNAL_PORT),
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
});

// default to environment variables from the process
let useEnv = readEnv();

// if environment variables aren't available from the process, read from .env file
if (Object.values(useEnv).every(v => v === undefined || !isFinite(Number(v)))) {
  dotenv.config();
  useEnv = readEnv();
  logger('env.ts::__Reading "env" variables from ".env" file...', { v: useEnv, i: '🐱‍👤', c: L_C.GREEN });
} else {
  logger('env.ts::__Reading "env" variables from environment (NOT ".env" file)...', { v: useEnv, i: '🐱‍👤', c: L_C.GREEN }
  );
}

// validate environment variables exist
Object.entries(useEnv).forEach(([k, v]) => {
  if (v === undefined) throw new TypeError(`Missing useEnv variable: "${k}"`);
  if (typeof v === 'number' && !Number.isFinite(v)) throw new Error(`Missing / invalid useEnv variable: "${k}" - "${v}"`);
});

export const env = useEnv;