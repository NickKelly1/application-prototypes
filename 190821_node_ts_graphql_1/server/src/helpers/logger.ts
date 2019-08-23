import { AValueOf } from './helper-types';
import { inspect } from 'util';

// log colours
export const L_C = {
  GREEN: 'green',
  DODGER_BLUE: 'dodgerblue',
  RED: 'red',
  ORANGE: 'orange',
  BLACK: 'black',
  GOLD: 'gold',
  YELLOW: 'yellow',
  SPRING_GREEN: 'springgreen',
} as const;



const NO_VALUE = Symbol('NO_VALUE');

let nowCache: undefined | string;
const unrefTimeout = () => nowCache = undefined;
function cache() {
  const d = new Date();
  const YYYY = d.getFullYear();
  const MM = d.getMonth().toString().padStart(2, '0');
  const DD = d.getDate().toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');

  nowCache = `${YYYY}-${MM}-${DD}-${hh}:${mm}:${ss}`;
  setTimeout(unrefTimeout, 1000 - d.getMilliseconds());
  return nowCache;
}

function nowTime() {
  if (!nowCache) return cache();
  return nowCache;
}

/**
 * @description
 * Log to the console with i and color
 *
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
 *
 * @param title
 * @param param1
 */
export function logger(
  title: string,
  {
    // icon
    i = '🍀',
    // colour
    c,
    // value
    v = NO_VALUE,

    // inspect options
    dontInspect = false,
    inspectColours = true,
    inspectDepth = 3,
    inspectMaxArrayLength = 100,
    inspectShowHidden = true,
    inspectShowProxy = true,
    inspectSorted = true,
  }: {
    i?: string;
    c?: AValueOf<typeof L_C>;
    v?: any;

    // inspect options
    dontInspect?: boolean;
    inspectColours?: boolean;
    inspectDepth?: number;
    inspectMaxArrayLength?: number;
    inspectProxy?: boolean;
    inspectShowHidden?: boolean;
    inspectShowProxy?: boolean;
    inspectSorted?: boolean;
  } = {},
) {
  if (!dontInspect && v instanceof Object) v = inspect(v, {
    colors: inspectColours,
    depth: inspectDepth,
    maxArrayLength: inspectMaxArrayLength,
    showHidden: inspectShowHidden,
    showProxy: inspectShowProxy,
    sorted: inspectSorted,
  });

  const now = nowTime();
  const toLog = [ c ? `[${now}] %c${i} ${title}` : `[${now}] ${i} ${title}` ];
  if (c) toLog.push(`color:${c}`);
  if (v !== NO_VALUE) toLog.push(v);

  console.log(...toLog);
}