import { ElementOf, ValueFrom } from '../../../../@types/helpers';
import { inThisButNotThat } from '../../../helpers/in-this-but-not-that';

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

/**
 * @constant
 * @description
 * Timers
 */
export const SOCCER_CLOCK_TIMER = {
  HALTED: 'halted',
  PAUSED: 'paused',
  RUNNING: 'running',
} as const;
export type SOCCER_CLOCK_TIMER = typeof SOCCER_CLOCK_TIMER;

/**
 * @constant
 * @description
 * Array of all timers
 */
export const SOCCER_CLOCK_ALL_TIMERS = Object.values(SOCCER_CLOCK_TIMER);
export type SOCCER_CLOCK_ALL_TIMERS = typeof SOCCER_CLOCK_ALL_TIMERS;

/**
 * @interface
 * @description
 * Interface for a periods timer object (has 3 timers)
 */
interface SoccerClockPeriodTimer {
  [SOCCER_CLOCK_TIMER.HALTED]: number;
  [SOCCER_CLOCK_TIMER.PAUSED]: number;
  [SOCCER_CLOCK_TIMER.RUNNING]: number;
}

/**
 * @constant
 * @description
 * Array of all soccer clock periods
 */
export const SOCCER_CLOCK_ALL_PERIODS = Object.values(SOCCER_CLOCK_PERIOD);
export type SOCCER_CLOCK_ALL_PERIODS = typeof SOCCER_CLOCK_ALL_PERIODS;

/**
 * @constant
 * @description
 * Array of soccer clock periods WITH timers
 */
export const SOCCER_CLOCK_PERIODS_WITH_TIMERS = [
  SOCCER_CLOCK_PERIOD.FIRST_HALF,
  SOCCER_CLOCK_PERIOD.MID_BREAK,
  SOCCER_CLOCK_PERIOD.SECOND_HALF,
  SOCCER_CLOCK_PERIOD.PENALTIES,
] as const;
export type SOCCER_CLOCK_PERIODS_WITH_TIMERS = typeof SOCCER_CLOCK_PERIODS_WITH_TIMERS;

/**
 * @constant
 * @description
 * Array of soccer clock periods WITHOUT timers
 */
export const SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS = inThisButNotThat(
  SOCCER_CLOCK_ALL_PERIODS,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
);
export type SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS = typeof SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS;

/**
 * @constant
 * @description
 * Periods in which the soccer clock can "begin"
 */
export const SOCCER_CLOCK_CAN_BEGIN_PERIODS = [SOCCER_CLOCK_PERIOD.NOT_STARTED] as const;

/**
 * @type
 * @description
 * Type representing the soccer clocks periods and their corresponding timer interfaces
 */
export type SoccerClockPeriodTimers = Record<ElementOf<SOCCER_CLOCK_PERIODS_WITH_TIMERS>, SoccerClockPeriodTimer>;

/**
 * @interface
 * @description
 * State of a single soccer clock
 */
export interface SingleSoccerClockState {
  currentPeriod: ValueFrom<SOCCER_CLOCK_PERIOD>;
  currentTimer: null | ValueFrom<SOCCER_CLOCK_TIMER>;
  lastTimeSwitched: null | number;
  timers: SoccerClockPeriodTimers;
}

export type SoccerClockState = SingleSoccerClockState;
