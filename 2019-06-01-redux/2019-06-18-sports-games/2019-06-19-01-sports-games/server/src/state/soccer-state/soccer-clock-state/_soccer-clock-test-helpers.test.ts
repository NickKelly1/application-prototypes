import {
  SoccerClockState,
  SOCCER_CLOCK_TIMER,
  SingleSoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
} from './soccer-clock-state';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { createStore } from '../../../lib/store/store';
import { soccerClockReducer } from './soccer-clock-reducer';
import { tupleIncludes } from '../../../helpers/tuple-includes';
import { inThisButNotThat } from '../../../helpers/in-this-but-not-that';

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

const soccerClockStateFactory = (inputSoccerClockState: Partial<SoccerClockState> = {}) => {
  // validate state
  if (
    inputSoccerClockState.currentPeriod === undefined &&
    (inputSoccerClockState.currentTimer !== undefined || inputSoccerClockState.lastTimeSwitched !== undefined)
  ) {
    throw new TypeError('Test Setup Error: must provide "currentPeriod" with "currentTimer" and "lastTimeSwitched".');
  }

  if (
    (inputSoccerClockState.currentTimer === undefined && inputSoccerClockState.lastTimeSwitched !== undefined) ||
    (inputSoccerClockState.currentTimer !== undefined && inputSoccerClockState.lastTimeSwitched === undefined)
  ) {
    throw new TypeError('Test Setup Error: "currentTimer" and "lastTimeSwitched" must be provided together.');
  }

  if (inputSoccerClockState.currentPeriod !== undefined && inputSoccerClockState.currentTimer !== undefined) {
    const z = inThisButNotThat(SOCCER_CLOCK_PERIODS_WITH_TIMERS, inputSoccerClockState.currentPeriod);
    // throw new TypeError('');
  }

  return { ...defaultInitialSoccerClockState, ...inputSoccerClockState };
};

// TODO make input throw compile error if not matching one of the potential inputs below
// (e.g. if you supply timer, you must also supply lastTimeSwitched)
const setup = (initialState = soccerClockStateFactory()) => {
  const store = createStore<SoccerClockState, SoccerGameActionTypes>(initialState, [soccerClockReducer]);

  return {
    initialState,
    store,
  };
};

export const soccerClockTestHelpers = {
  incrementTime,
  defaultInitialSoccerClockState,
  soccerClockStateFactory,
  setup,
};
