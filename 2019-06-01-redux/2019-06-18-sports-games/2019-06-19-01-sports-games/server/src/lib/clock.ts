import { $TS_FIX_ME } from '../../@types/ts-fix-me';
import { ClockMode } from './clock-types';

/**
 * @description
 *
 *
 * @example
 * const CLOCK_TYPES = {
 *   RESUME_TIMER: 'RESUME_TIMER' as const,
 *   PAUSE_TIMER: 'PAUSE_TIMER' as const,
 *   COUNTDOWN_TIMER : 'COUNTDOWN_TIMER' as const,
 * };
 * const ClockModes = {
 *   [CLOCK_TYPES.PAUSE_TIMER]: {
 *     direction: 1 as const,
 *     time: 0,
 *   },
 *   [CLOCK_TYPES.RESUME_TIMER]: {
 *     direction: 1 as const,
 *     time: 0,
 *   },
 *   [CLOCK_TYPES.COUNTDOWN_TIMER]: {
 *     direction: -1 as const,
 *     time: 30,
 *   },
 * };
 */
export const createClock = <Modes extends ClockMode, ModeMap extends Record<string, Modes>>(
  allowableClockModes: ModeMap,
  defaultClockMode: keyof ModeMap,
) => {
  const modes = allowableClockModes;
  let currentMode = allowableClockModes[defaultClockMode];
  let lastTimeSwitched = Date.now();

  const timeSpentInModes: $TS_FIX_ME<Record<keyof ModeMap, number>> = Object.entries(modes).reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: $TS_FIX_ME<any>, cur: $TS_FIX_ME<any>) => {
      acc[cur[0]] = { ...cur[1] };
      return acc;
    },
    {},
  );

  const switchMode = (nextMode: keyof ModeMap) => {
    const now = Date.now();
    currentMode.time = currentMode.time + currentMode.direction * (now - lastTimeSwitched);
    // reset counter and switch to the next mode
    lastTimeSwitched = now;
    currentMode = modes[nextMode];
  };

  return {
    getTimeSpentInMode: (mode: keyof ModeMap) => timeSpentInModes[mode],
    getCurrentMode: () => currentMode,
    switchMode,
  };
};
