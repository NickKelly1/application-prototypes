import dotenv from 'dotenv';

dotenv.config();

/**
 * @description
 * Environment variables
 */
export const env = {
  PORT: Number((process.env as any).PORT),
};

Object.entries(env).forEach(([key, val]) => {
  if (val === undefined || Number.isNaN(val)) {
    throw new TypeError(`Invalid environment variable. "${key}": "${val}"`);
  }
});
