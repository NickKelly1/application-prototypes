import { ElementOf, ValueFrom } from '../../../../@types/helpers';

// const rather than enum so we can get a union type of SOME OF the values
// useful for for tuples
export const SOCCER_CLOCK_PERIOD = {
  NOT_STARTED: 'notStarted',
  FIRST_HALF: 'firstHalf',
  MID_BREAK: 'midBreak',
  SECOND_HALF: 'secondHalf',
  PENALTIES: 'penalties',
  GAME_OVER: 'gameOver',
} as const;

export type SOCCER_CLOCK_PERIOD = typeof SOCCER_CLOCK_PERIOD;

// export enum SOCCER_CLOCK_TIMER {
//   HALTED = 'halted',
//   PAUSED = 'paused',
//   RUNNING = 'running',
// }
export const SOCCER_CLOCK_TIMER = {
  HALTED: 'halted',
  PAUSED: 'paused',
  RUNNING: 'running',
} as const;

export type SOCCER_CLOCK_TIMER = typeof SOCCER_CLOCK_TIMER;

interface SoccerClockPeriodTimer {
  [SOCCER_CLOCK_TIMER.HALTED]: number;
  [SOCCER_CLOCK_TIMER.PAUSED]: number;
  [SOCCER_CLOCK_TIMER.RUNNING]: number;
}

// const SOCCER_CLOCK_ALL_PERIODS = Object.values(SOCCER_CLOCK_PERIOD);

/**
 * @description
 * Array of Soccer Clock Periods with timers
 */
export const SOCCER_CLOCK_PERIODS_WITH_TIMERS = [
  SOCCER_CLOCK_PERIOD.FIRST_HALF,
  SOCCER_CLOCK_PERIOD.MID_BREAK,
  SOCCER_CLOCK_PERIOD.SECOND_HALF,
  SOCCER_CLOCK_PERIOD.PENALTIES,
] as const;

export type SOCCER_CLOCK_PERIODS_WITH_TIMERS = typeof SOCCER_CLOCK_PERIODS_WITH_TIMERS;

/**
 * @description
 * Periods in which the soccer clock can "begin"
 */
export const SOCCER_CLOCK_CAN_BEGIN_PERIODS = [SOCCER_CLOCK_PERIOD.NOT_STARTED] as const;

export type SoccerClockPeriodTimers = Record<ElementOf<SOCCER_CLOCK_PERIODS_WITH_TIMERS>, SoccerClockPeriodTimer>;

export interface SingleSoccerClockState {
  currentPeriod: ValueFrom<SOCCER_CLOCK_PERIOD>;
  currentTimer: null | ValueFrom<SOCCER_CLOCK_TIMER>;
  lastTimeSwitched: null | number;
  timers: SoccerClockPeriodTimers;
}

export type SoccerClockState = SingleSoccerClockState;
