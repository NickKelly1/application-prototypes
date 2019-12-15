import { tty } from './tty.helper';

let prev: Date;

/**
 * @description
 * Human readable date
 *
 * @NOTE: this seems to exhibit strange behavior where dates are
 * not accurate to the second (seems to jump back and forth seconds?)
 *
 * @param date
 */
export function hDate(date?: Date, color: null | keyof tty = 'FgBlue') {
  const next = date ?? new Date();

  // should NEVER return negative numbers, but somehow does
  // if (prev) console.log('===========', next.valueOf() - prev!.valueOf());
  // prev = next;

  const humanReadableDate = [
    next.getFullYear().toString().padStart(4, '0'),
    '-',
    (next.getMonth() + 1).toString().padStart(2, '0'),
    '-',
    (next.getDate() + 1).toString().padStart(2, '0'),
    ' ',
    (next.getHours() % 12).toString().padStart(2, '0'),
    ':',
    next.getMinutes().toString().padStart(2, '0'),
    ':',
    next.getSeconds().toString().padStart(2, '0'),
    ' ',
    next.getHours() >= 12 ? 'PM' : 'AM',
  ].join('');

  if (color === null) return humanReadableDate;

  return tty[color](humanReadableDate);
}
