import { AValueOf } from './helper-types';

export const LOG_COLOURS = {
  GREEN: 'green',
  DODGER_BLUE: 'dodgerblue',
  RED: 'red',
  ORANGE: 'orange',
  BLACK: 'black',
  GOLD: 'gold',
  YELLOW: 'yellow',
  SPRING_GREEN: 'springgreen',
} as const;


/**
 * @description
 * Log to the console with icon and color
 *
 * @param title
 * @param param1
 */
export function logger(
  title: string,
  { icon = '🍀', colour = LOG_COLOURS.BLACK, message }: { icon?: string; colour?: AValueOf<typeof LOG_COLOURS>; message?: any } = {},
) {
  console.log(`%c${icon} ${title}`, `color:${colour}`, message);
}