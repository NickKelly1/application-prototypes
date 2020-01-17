import { argv } from 'yargs';

function parseNumber(name: string, inp: unknown): number {
  if (inp === undefined) throw new TypeError(`${name} is required`);
  const numInp = Number(inp);
  if (Number.isNaN(numInp) || !Number.isFinite(numInp)) throw new TypeError(`${name} must be a number.`);
  return numInp;
}

function gt(name: string, val: number, inp: number): number {
  if (inp <= val) throw new TypeError(`${name} must be greater than ${inp}`);
  return inp;
}

// function gte(name: string, val: number, inp: number): number {
//   if (inp < val) throw new TypeError(`${name} must be greater than or equal to ${inp}`);
//   return inp;
// }

// function lt(name: string, val: number, inp: number): number {
//   if (inp >= val) throw new TypeError(`${name} must be greater than ${inp}`);
//   return inp;
// }

// function lte(name: string, val: number, inp: number): number {
//   if (inp >= val) throw new TypeError(`${name} must be less than or equal to ${inp}`);
//   return inp;
// }


/**
 * @description
 * Environment variables
 */
export const env = {
  PORT: Math.max(gt('--port', 0, parseNumber('--port', argv.port))),
};

Object.entries(env).forEach(([key, val]) => {
  if (val === undefined || Number.isNaN(val)) {
    throw new TypeError(`Invalid environment variable. "${key}": "${val}"`);
  }
});
