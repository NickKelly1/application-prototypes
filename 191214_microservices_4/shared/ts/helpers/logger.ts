import { hDate } from './h-date.helper';
import { tty } from './tty.helper';

/**
 * @description
 * Create a named logger
 *
 * @param name
 */
export function createLogger(name?: string) {
  const prefix = [
    `[${hDate()}]`,
    ...(name ? [`[${tty.FgYellow(name)}]`] : []),
  ];

  const logger = {
    dInfo(...args: any[]) { console.log(...prefix, ...args); },
  } as const;

  return logger;
}

/**
 * @description
 * Create a named logger for a class
 *
 * @param that
 */
export function classLogger(that: ThisType<any>) {
  return createLogger(Object.getPrototypeOf(that).constructor.name);
}

/**
 * @description
 * Nameless logger
 */
export const logger = createLogger();
