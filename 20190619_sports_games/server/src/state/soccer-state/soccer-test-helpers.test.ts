import {
  SoccerClockState,
  SOCCER_CLOCK_TIMER,
  SingleSoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_ALL_TIMERS,
  SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS,
} from './soccer-clock-state/soccer-clock-state';
import { tupleIncludes } from '../../helpers/tuple-includes';
import { ValueFrom } from '../../../@types/helpers';
import { SoccerTeamsState, SOCCER_TEAM_NUMBER, SOCCER_TEAM_SIDE } from './soccer-team-state/soccer-team-state';
import { SoccerState } from './soccer-state';

const MAX_TIME_INCREMENT = 10_000; // 10 seconds

const incrementTime = (now: number) => {
  const timeIncrement = Math.floor(MAX_TIME_INCREMENT * Math.random()) + 1;
  const nextNow = now + timeIncrement;
  return { timeIncrement, nextNow };
};

export const defaultInitialSoccerClockTestState: SingleSoccerClockState = {
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
export const createSoccerClockTestState = (inputSoccerClockState: Partial<SoccerClockState> = {}) => {
  // validate state

  const state = {
    ...defaultInitialSoccerClockTestState,
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

const defaultInitialSoccerTeamTestState: SoccerTeamsState = {
  [SOCCER_TEAM_NUMBER.ONE]: {
    number: SOCCER_TEAM_NUMBER.ONE,
    name: 'Home-side Hamsters',
    score: 0,
    order: 1,
    side: SOCCER_TEAM_SIDE.HOME,
  },
  [SOCCER_TEAM_NUMBER.TWO]: {
    number: SOCCER_TEAM_NUMBER.TWO,
    name: 'Away-side Aardvarks',
    score: 0,
    order: 2,
    side: SOCCER_TEAM_SIDE.AWAY,
  },
};

/**
 * @description
 * Creates a valid soccer team state
 *
 * @todo: state validation
 *
 * @param inputSoccerTeamState
 */
const createSoccerTeamTestState = (inputSoccerTeamState: Partial<SoccerTeamsState> = {}) => {
  const state: SoccerTeamsState = { ...defaultInitialSoccerTeamTestState, ...inputSoccerTeamState };
  return state;
};

const defaultInitialSoccerTestState: SoccerState = {
  clock: defaultInitialSoccerClockTestState,
  teams: defaultInitialSoccerTeamTestState,
};

/**
 * @description
 * Creates a valid soccer state
 *
 * @todo: state validation
 *
 * @param inputSoccerState
 */
const createSoccerTestState = (
  inputSoccerState: Partial<{
    teams: Partial<SoccerTeamsState>;
    clock: Partial<SoccerClockState>;
  }> = {},
) => {
  const state: SoccerState = {
    teams: createSoccerTeamTestState(inputSoccerState.teams),
    clock: createSoccerClockTestState(inputSoccerState.clock),
  };
  return state;
};

export const soccerTestHelpers = {
  incrementTime,
  defaultInitialSoccerClockTestState,
  defaultInitialSoccerTeamTestState,
  defaultInitialSoccerTestState,
  createSoccerClockTestState,
  createSoccerTeamTestState,
  createSoccerTestState,
};

// ********************************
// ********************************
// tests
// ********************************
// ********************************

/**
 * @description
 * Convert the value to string and get the last 4 characters
 *
 * @param stringable
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const last4 = (stringable: any) => {
  const stringed = String(stringable);
  const length = stringed.length;
  return length > 4 ? stringed.substr(length - 4) : stringed;
};

describe('Soccer Clock Helpers', () => {
  // ltsa -> last time switched at
  let ltsa: null | number = null;
  let timer: null | ValueFrom<SOCCER_CLOCK_TIMER> = null;
  describe('createSoccerClockTestState', () => {
    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(periodWithTimer => {
      /**
       * @test cannot create invalid state
       * IN       - PERIOD_WITH_TIMER
       * WITH NO  - TIMER
       * WITH NO  - LAST_TIME_SWITCHED
       */
      timer = null;
      ltsa = null;
      it(`[period = ${periodWithTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should fail to create state`, () => {
        timer = null;
        ltsa = null;
        expect(() =>
          createSoccerClockTestState({ currentPeriod: periodWithTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
        ).toThrowError();
      });

      /**
       * @test cannot create invalid state
       * IN       - PERIOD_WITH_TIMER
       * WITH NO  - TIMER
       * WITH     - LAST_TIME_SWITCHED
       */
      timer = null;
      ltsa = Date.now();
      it(`[period = ${periodWithTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should fail to create state`, () => {
        timer = null;
        ltsa = Date.now();
        expect(() =>
          createSoccerClockTestState({ currentPeriod: periodWithTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
        ).toThrowError();
      });

      SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
        /**
         * @test cannot create invalid state
         * IN       - PERIOD_WITH_TIMER
         * WITH     - TIMER
         * WITH NO  - LAST_TIME_SWITCHED
         */
        ltsa = null;
        it(`[period = ${periodWithTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should fail to create state`, () => {
          ltsa = null;
          expect(() =>
            createSoccerClockTestState({ currentPeriod: periodWithTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
          ).toThrowError();
        });

        /**
         * @test can create valid state
         * IN     - PERIOD_WITH_TIMER
         * WITH   - TIMER
         * WITH   - LAST_TIME_SWITCHED
         */
        ltsa = Date.now();
        it(`[period = ${periodWithTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should successfully create state`, () => {
          ltsa = Date.now();
          expect(() =>
            createSoccerClockTestState({ currentPeriod: periodWithTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
          ).not.toThrowError();
        });
      });
    });

    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(periodWOutTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
        /**
         * @test cannot create invalid state
         * IN       - PERIOD_WITH_TIMER
         * WITH     - TIMER
         * WITH     - LAST_TIME_SWITCHED
         */
        ltsa = Date.now();
        it(`[period = ${periodWOutTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should fail to create state`, () => {
          ltsa = Date.now();
          expect(() =>
            createSoccerClockTestState({ currentPeriod: periodWOutTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
          ).toThrowError();
        });

        /**
         * @test cannot create invalid state
         * IN       - PERIOD_WITH_TIMER
         * WITH     - TIMER
         * WITH NO  - LAST_TIME_SWITCHED
         */
        ltsa = null;
        it(`[period = ${periodWOutTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should fail to create state`, () => {
          ltsa = null;
          expect(() =>
            createSoccerClockTestState({ currentPeriod: periodWOutTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
          ).toThrowError();
        });
      });

      /**
       * @test cannot create invalid state
       * IN       - PERIOD_WITH_TIMER
       * WITH NO  - TIMER
       * WITH     - LAST_TIME_SWITCHED
       */
      timer = null;
      ltsa = Date.now();
      it(`[period = ${periodWOutTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should fail to create state`, () => {
        timer = null;
        ltsa = Date.now();
        expect(() =>
          createSoccerClockTestState({ currentPeriod: periodWOutTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
        ).toThrowError();
      });

      /**
       * @test can create valid state
       * IN       - PERIOD_WITH_TIMER
       * WITH NO  - TIMER
       * WITH NO  - LAST_TIME_SWITCHED
       */
      timer = null;
      ltsa = null;
      it(`[period = ${periodWOutTimer}][timer = ${timer}][ltsa = ${last4(ltsa)}] Should successfully create state`, () => {
        timer = null;
        ltsa = null;
        expect(() =>
          createSoccerClockTestState({ currentPeriod: periodWOutTimer, currentTimer: timer, lastTimeSwitched: ltsa }),
        ).not.toThrowError();
      });
    });
  });
});
