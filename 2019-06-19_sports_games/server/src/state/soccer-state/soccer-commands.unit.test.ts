import {
  SOCCER_CLOCK_ALL_PERIODS,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_ALL_TIMERS,
  SOCCER_CLOCK_CAN_BEGIN_PERIODS,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS,
} from './soccer-clock-state/soccer-clock-state';
import { SoccerCommands, SOCCER_COMMANDS } from './soccer-commands';
import { soccerTestHelpers } from './soccer-test-helpers.test';
import { SoccerState } from './soccer-state';
import { SoccerEventPayloads } from './soccer-events';
import { createStore } from '../../lib/store/store';
import { soccerReducer } from './soccer-reducer';
import { tupleIncludes } from '../../helpers/tuple-includes';
import { inThisAndThat } from '../../helpers/in-this-and-that';
import { inThisButNotThat } from '../../helpers/in-this-but-not-that';

/**
 * @description
 * Setup for tests
 *
 * @param initialState
 */
const setup = (initialState = soccerTestHelpers.createSoccerTestState()) => {
  const store = createStore<SoccerState, SoccerEventPayloads>(initialState, [soccerReducer]);

  return {
    initialState,
    store,
  };
};

/**
 * TODO: improve assertions
 */
describe('Soccer Clock Actions', () => {
  /**
   * @description newGame
   */
  describe('newGame', () => {
    const { store } = setup();
    const soccerCommands = new SoccerCommands(store);
    const now = Date.now();

    /**
     * @test
     */
    it('should craft a new game with the provided state', () => {
      SOCCER_CLOCK_ALL_PERIODS.forEach(period => {
        if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, period)) {
          SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
            // periods with timers
            const { nextNow } = soccerTestHelpers.incrementTime(now);

            soccerCommands[SOCCER_COMMANDS.NEW_GAME](
              soccerTestHelpers.createSoccerClockTestState({
                currentPeriod: period,
                currentTimer: timer,
                lastTimeSwitched: nextNow,
              }),
            );
            expect(store.getState().clock.currentPeriod).toBe(period);
            expect(store.getState().clock.currentTimer).toBe(timer);
            expect(store.getState().clock.lastTimeSwitched).toBe(nextNow);
          });
        } else {
          // periods without timers
          soccerCommands[SOCCER_COMMANDS.NEW_GAME](
            soccerTestHelpers.createSoccerClockTestState({
              currentPeriod: period,
            }),
          );
          expect(store.getState().clock.currentPeriod).toBe(period);
          expect(store.getState().clock.currentTimer).toBe(null);
          expect(store.getState().clock.lastTimeSwitched).toBe(null);
        }
      });
    });
  });

  /**
   * @description beginGame
   */
  describe('beginGame', () => {
    inThisAndThat(SOCCER_CLOCK_ALL_PERIODS, SOCCER_CLOCK_CAN_BEGIN_PERIODS).forEach(canBeginPeriod => {
      /**
       * @test
       * periods with timers
       */
      if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, canBeginPeriod)) {
        SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
          it(`Should successfully begin game in [${canBeginPeriod}][${timer}]`, () => {
            const now = Date.now();
            const { nextNow, timeIncrement } = soccerTestHelpers.incrementTime(now);
            const { store } = setup(
              soccerTestHelpers.createSoccerTestState({
                clock: {
                  currentPeriod: canBeginPeriod,
                  currentTimer: timer,
                  lastTimeSwitched: now,
                },
              }),
            );
            const soccerCommands = new SoccerCommands(store);
            const oldTimers = store.getState().clock.timers;
            soccerCommands[SOCCER_COMMANDS.BEGIN_GAME](nextNow);
            expect(store.getState().clock.currentPeriod).toBe(SOCCER_CLOCK_PERIOD.FIRST_HALF);
            expect(store.getState().clock.currentTimer).toBe(SOCCER_CLOCK_TIMER.RUNNING);
            expect(store.getState().clock.lastTimeSwitched).toBe(timeIncrement);
            expect(store.getState().clock.timers).toEqual(oldTimers);
          });
        });
      } else {
        /**
         * @test
         * periods without timers
         */
        it(`Should begin game in [${canBeginPeriod}]`, () => {
          const now = Date.now();
          const { store } = setup(
            soccerTestHelpers.createSoccerTestState({
              clock: { currentPeriod: canBeginPeriod },
            }),
          );
          const soccerCommands = new SoccerCommands(store);
          soccerCommands[SOCCER_COMMANDS.BEGIN_GAME](now);
          expect(store.getState().clock.currentPeriod).toBe(SOCCER_CLOCK_PERIOD.FIRST_HALF);
          expect(store.getState().clock.currentTimer).toBe(SOCCER_CLOCK_TIMER.RUNNING);
          expect(store.getState().clock.lastTimeSwitched).toBe(now);
        });
      }
    });

    inThisButNotThat(SOCCER_CLOCK_ALL_PERIODS, SOCCER_CLOCK_CAN_BEGIN_PERIODS).forEach(cantBeginPeriod => {
      /**
       * @test
       * periods with timers
       */
      if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, cantBeginPeriod)) {
        SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
          it(`Should fail to begin game in [${cantBeginPeriod}][${timer}]`, () => {
            const now = Date.now();
            const { nextNow } = soccerTestHelpers.incrementTime(now);
            const { store } = setup(
              soccerTestHelpers.createSoccerTestState({
                clock: {
                  currentPeriod: cantBeginPeriod,
                  currentTimer: timer,
                  lastTimeSwitched: now,
                },
              }),
            );
            const soccerCommands = new SoccerCommands(store);
            expect(() => soccerCommands[SOCCER_COMMANDS.BEGIN_GAME](nextNow)).toThrowError();
          });
        });
      } else {
        /**
         * @test
         * periods without timers
         */
        it(`Should fail to begin game in [${cantBeginPeriod}]`, () => {
          const now = Date.now();
          const { store } = setup(
            soccerTestHelpers.createSoccerTestState({
              clock: {
                currentPeriod: cantBeginPeriod,
              },
            }),
          );
          const soccerCommands = new SoccerCommands(store);
          expect(() => soccerCommands[SOCCER_COMMANDS.BEGIN_GAME](now)).toThrowError();
        });
      }
    });
  });

  /**
   * @description haltGame
   */
  describe('haltGame', () => {
    /**
     * @test
     * periods with timers
     */
    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(periodWithTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
        it(`Should successfully halt game in [${periodWithTimer}][${previousTimer}]`, () => {
          const now = Date.now();
          const { nextNow, timeIncrement } = soccerTestHelpers.incrementTime(now);
          const { store } = setup(
            soccerTestHelpers.createSoccerTestState({
              clock: {
                currentPeriod: periodWithTimer,
                currentTimer: previousTimer,
                lastTimeSwitched: now,
              },
            }),
          );
          const soccerCommands = new SoccerCommands(store);
          const oldTimers = store.getState().clock.timers;

          soccerCommands[SOCCER_COMMANDS.HALT_GAME](nextNow);
          expect(store.getState().clock.currentPeriod).toBe(periodWithTimer);
          expect(store.getState().clock.currentTimer).toBe(SOCCER_CLOCK_TIMER.HALTED);
          expect(store.getState().clock.timers).toEqual({
            ...oldTimers,
            [periodWithTimer]: {
              ...oldTimers[periodWithTimer],
              [previousTimer]: oldTimers[periodWithTimer][previousTimer] + timeIncrement,
            },
          });
        });
      });
    });

    /**
     * @test
     * periods without timers
     */
    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(periodWithoutTimer => {
      it(`Should fail to halt game in [${periodWithoutTimer}]`, () => {
        const now = Date.now();
        const { store } = setup(
          soccerTestHelpers.createSoccerTestState({
            clock: {
              currentPeriod: periodWithoutTimer,
            },
          }),
        );
        const soccerCommands = new SoccerCommands(store);

        expect(() => soccerCommands[SOCCER_COMMANDS.HALT_GAME](now)).toThrowError();
      });
    });
  });

  /**
   * @description pauseGame
   */
  describe('pauseGame', () => {
    /**
     * @test
     * periods with timers
     */
    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(periodWithTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
        it(`Should successfully pause game in [${periodWithTimer}][${previousTimer}]`, () => {
          const now = Date.now();
          const { nextNow, timeIncrement } = soccerTestHelpers.incrementTime(now);
          const { store } = setup(
            soccerTestHelpers.createSoccerTestState({
              clock: {
                currentPeriod: periodWithTimer,
                currentTimer: previousTimer,
                lastTimeSwitched: now,
              },
            }),
          );
          const soccerCommands = new SoccerCommands(store);
          const oldTimers = store.getState().clock.timers;
          soccerCommands.pauseGame(nextNow);
          expect(store.getState().clock.currentPeriod).toBe(periodWithTimer);
          expect(store.getState().clock.currentTimer).toBe(SOCCER_CLOCK_TIMER.PAUSED);
          expect(store.getState().clock.timers).toEqual({
            ...oldTimers,
            [periodWithTimer]: {
              ...oldTimers[periodWithTimer],
              [previousTimer]: oldTimers[periodWithTimer][previousTimer] + timeIncrement,
            },
          });
        });
      });
    });

    /**
     * @test
     * periods without timers
     */
    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(periodWithoutTimer => {
      it(`Should fail to pause game in [${periodWithoutTimer}]`, () => {
        const now = Date.now();
        const { nextNow } = soccerTestHelpers.incrementTime(now);
        const { store } = setup(
          soccerTestHelpers.createSoccerTestState({
            clock: {
              currentPeriod: periodWithoutTimer,
            },
          }),
        );
        const soccerCommands = new SoccerCommands(store);

        expect(() => soccerCommands[SOCCER_COMMANDS.PAUSE_GAME](nextNow)).toThrowError();
      });
    });
  });

  /**
   * @description resumeGame
   */
  describe('resumeGame', () => {
    /**
     * @test
     * periods with timers
     */
    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(periodWithTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
        it(`Should successfully pause game in [${periodWithTimer}][${previousTimer}]`, () => {
          const now = Date.now();
          const { nextNow, timeIncrement } = soccerTestHelpers.incrementTime(now);
          const { store } = setup(
            soccerTestHelpers.createSoccerTestState({
              clock: {
                currentPeriod: periodWithTimer,
                currentTimer: previousTimer,
                lastTimeSwitched: now,
              },
            }),
          );
          const soccerCommands = new SoccerCommands(store);
          const oldTimers = store.getState().clock.timers;
          soccerCommands[SOCCER_COMMANDS.RESUME_GAME](nextNow);
          expect(store.getState().clock.currentPeriod).toBe(periodWithTimer);
          expect(store.getState().clock.currentTimer).toBe(SOCCER_CLOCK_TIMER.RUNNING);
          expect(store.getState().clock.timers).toEqual({
            ...oldTimers,
            [periodWithTimer]: {
              ...oldTimers[periodWithTimer],
              [previousTimer]: oldTimers[periodWithTimer][previousTimer] + timeIncrement,
            },
          });
        });
      });
    });

    /**
     * @test
     * periods without timers
     */
    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(periodWithoutTimer => {
      it(`Should fail to pause game in [${periodWithoutTimer}]`, () => {
        const now = Date.now();
        const { nextNow } = soccerTestHelpers.incrementTime(now);
        const { store } = setup(
          soccerTestHelpers.createSoccerTestState({
            clock: {
              currentPeriod: periodWithoutTimer,
            },
          }),
        );
        const soccerCommands = new SoccerCommands(store);

        expect(() => soccerCommands[SOCCER_COMMANDS.RESUME_GAME](nextNow)).toThrowError();
      });
    });
  });

  /**
   * @description nextPeriod
   */
  describe('nextPeriod', () => {
    let previousNow = Date.now();
    const { store } = setup(
      soccerTestHelpers.createSoccerTestState({
        clock: {
          currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
          currentTimer: null,
          lastTimeSwitched: null,
        },
      }),
    );
    const soccerCommands = new SoccerCommands(store);

    soccerCommands[SOCCER_COMMANDS.BEGIN_GAME](previousNow);

    let incrementTimeResponse;
    let nextNow;
    let timeIncrement;
    let oldTimers;
    const timer = store.getState().clock.currentTimer;

    expect(timer).not.toBeNull();
    // to make TS not complain below
    if (timer === null) throw new Error('Timer cannot be null while game is running...');

    it(`Should take the state from [${store.getState().clock.currentPeriod}][${store.getState().clock.currentTimer}] to [${
      SOCCER_CLOCK_PERIOD.MID_BREAK
    }]`, () => {
      // first half
      oldTimers = store.getState().clock.timers;
      incrementTimeResponse = soccerTestHelpers.incrementTime(previousNow);
      nextNow = incrementTimeResponse.nextNow;
      timeIncrement = incrementTimeResponse.timeIncrement;
      soccerCommands[SOCCER_COMMANDS.NEXT_PERIOD](nextNow);
      expect(store.getState().clock.currentPeriod).toBe(SOCCER_CLOCK_PERIOD.MID_BREAK);
      expect(store.getState().clock.currentTimer).toBe(timer);
      expect(store.getState().clock.timers).toEqual({
        ...oldTimers,
        [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
          ...oldTimers[SOCCER_CLOCK_PERIOD.FIRST_HALF],
          [timer]: oldTimers[SOCCER_CLOCK_PERIOD.FIRST_HALF][timer] + timeIncrement,
        },
      });
      previousNow = nextNow;
    });

    it(`Should take the state from [${store.getState().clock.currentPeriod}][${store.getState().clock.currentTimer}] to [${
      SOCCER_CLOCK_PERIOD.SECOND_HALF
    }]`, () => {
      // mid break
      oldTimers = store.getState().clock.timers;
      incrementTimeResponse = soccerTestHelpers.incrementTime(previousNow);
      nextNow = incrementTimeResponse.nextNow;
      timeIncrement = incrementTimeResponse.timeIncrement;
      soccerCommands[SOCCER_COMMANDS.NEXT_PERIOD](nextNow);
      expect(store.getState().clock.currentPeriod).toBe(SOCCER_CLOCK_PERIOD.SECOND_HALF);
      expect(store.getState().clock.currentTimer).toBe(timer);
      expect(store.getState().clock.timers).toEqual({
        ...oldTimers,
        [SOCCER_CLOCK_PERIOD.MID_BREAK]: {
          ...oldTimers[SOCCER_CLOCK_PERIOD.MID_BREAK],
          [timer]: oldTimers[SOCCER_CLOCK_PERIOD.MID_BREAK][timer] + timeIncrement,
        },
      });
      previousNow = nextNow;
    });

    it(`Should take the state from [${store.getState().clock.currentPeriod}][${store.getState().clock.currentTimer}] to [${
      SOCCER_CLOCK_PERIOD.GAME_OVER
    }]`, () => {
      // mid break
      oldTimers = store.getState().clock.timers;
      incrementTimeResponse = soccerTestHelpers.incrementTime(previousNow);
      nextNow = incrementTimeResponse.nextNow;
      timeIncrement = incrementTimeResponse.timeIncrement;
      soccerCommands[SOCCER_COMMANDS.NEXT_PERIOD](nextNow);
      expect(store.getState().clock.currentPeriod).toBe(SOCCER_CLOCK_PERIOD.GAME_OVER);
      expect(store.getState().clock.currentTimer).toBeNull();
      expect(store.getState().clock.timers).toEqual({
        ...oldTimers,
        [SOCCER_CLOCK_PERIOD.SECOND_HALF]: {
          ...oldTimers[SOCCER_CLOCK_PERIOD.SECOND_HALF],
          [timer]: oldTimers[SOCCER_CLOCK_PERIOD.SECOND_HALF][timer] + timeIncrement,
        },
      });
      previousNow = nextNow;
    });
  });
});
