import {
  SoccerClockState,
  SOCCER_CLOCK_TIMER,
  SingleSoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_ALL_TIMERS,
} from './soccer-clock-state';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { createStore } from '../../../lib/store/store';
import { soccerClockReducer } from './soccer-clock-reducer';
import { tupleIncludes } from '../../../helpers/tuple-includes';

const MAX_TIME_INCREMENT = 10_000; // 10 seconds

const incrementTime = (now: number) => {
  const timeIncrement = Math.floor(MAX_TIME_INCREMENT * Math.random()) + 1;
  const nextNow = now + timeIncrement;
  return { timeIncrement, nextNow };
};

const defaultInitialSoccerClockState: SingleSoccerClockState = {
  currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
  currentTimer: null,
  lastTimeSwitched: null,
  timers: {
    firstHalf: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    midBreak: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    secondHalf: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    penalties: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
  },
} as const;

/**
 * @description
 * Creates a valid soccer clock state
 *
 * @param inputSoccerClockState
 * @throws {TypeError}
 */
const createSoccerClockState = (inputSoccerClockState: Partial<SoccerClockState> = {}) => {
  // validate state

  const state = {
    ...defaultInitialSoccerClockState,
    ...inputSoccerClockState,
  };

  if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, state.currentPeriod)) {
    if (!(tupleIncludes(SOCCER_CLOCK_ALL_TIMERS, state.currentTimer) && typeof state.lastTimeSwitched === 'number')) {
      throw new TypeError(
        `Test Setup Error: currentTimer (provided: "${state.currentTimer}") and lastTimeSwitched (provided: "${state.lastTimeSwitched}") are required for period (provided: "${state.currentPeriod}") with timer`,
      );
    }
  } else {
    if (!(state.currentTimer === null && state.lastTimeSwitched === null)) {
      throw new TypeError(
        `Test Setup Error: cannot provide currentTimer (provided: "${state.currentTimer}") or lastTimeSwitched (provided: "${state.lastTimeSwitched}") for period (provided: "${state.currentPeriod}") without timer`,
      );
    }
  }

  return state;
};

// TODO make input throw compile error if not matching one of the potential inputs below
// (e.g. if you supply timer, you must also supply lastTimeSwitched)
const setup = (initialState = createSoccerClockState()) => {
  const store = createStore<SoccerClockState, SoccerGameActionTypes>(initialState, [soccerClockReducer]);

  return {
    initialState,
    store,
  };
};

export const soccerClockTestHelpers = {
  incrementTime,
  defaultInitialSoccerClockState,
  createSoccerClockState,
  setup,
};
