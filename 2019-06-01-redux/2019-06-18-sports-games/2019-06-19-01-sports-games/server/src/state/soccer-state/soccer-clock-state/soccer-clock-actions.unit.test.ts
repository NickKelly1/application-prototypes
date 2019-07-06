import { soccerClockActions } from './soccer-clock-actions';
import { soccerClockTestHelpers } from './soccer-clock.helpers.test';
import {
  SOCCER_CLOCK_ALL_PERIODS,
  SOCCER_CLOCK_ALL_TIMERS,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_CAN_BEGIN_PERIODS,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS,
} from './soccer-clock-state';
import { tupleIncludes } from '../../../helpers/tuple-includes';
import { inThisButNotThat } from '../../../helpers/in-this-but-not-that';
import { inThisAndThat } from '../../../helpers/in-this-and-that';

describe('Soccer Clock Actions', () => {
  /**
   * @description newGame
   */
  describe('newGame', () => {
    const { store } = soccerClockTestHelpers.setup();
    const now = Date.now();

    /**
     * @test
     */
    it('can be created', () => {
      SOCCER_CLOCK_ALL_PERIODS.forEach(period => {
        if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, period)) {
          SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
            // periods with timers
            const { nextNow } = soccerClockTestHelpers.incrementTime(now);
            soccerClockActions.newGame(
              soccerClockTestHelpers.createSoccerClockState({
                currentPeriod: period,
                currentTimer: timer,
                lastTimeSwitched: nextNow,
              }),
            )(store.dispatch, store.getState);
            expect(store.getState().currentPeriod).toBe(period);
            expect(store.getState().currentTimer).toBe(timer);
            expect(store.getState().lastTimeSwitched).toBe(nextNow);
          });
        } else {
          // periods without timers
          soccerClockActions.newGame(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: period,
            }),
          )(store.dispatch, store.getState);
          expect(store.getState().currentPeriod).toBe(period);
          expect(store.getState().currentTimer).toBe(null);
          expect(store.getState().lastTimeSwitched).toBe(null);
        }
      });

      soccerClockActions;
    });
  });

  /**
   * @description beginGame
   */
  describe('beginGame', () => {
    const now = Date.now();
    inThisAndThat(SOCCER_CLOCK_ALL_PERIODS, SOCCER_CLOCK_CAN_BEGIN_PERIODS).forEach(canBeginPeriod => {
      /**
       * @test
       * periods with timers
       */
      if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, canBeginPeriod)) {
        SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
          it(`Should successfully begin game in [${canBeginPeriod}][${timer}]`, () => {
            const now = Date.now();
            const { nextNow, timeIncrement } = soccerClockTestHelpers.incrementTime(now);
            const { store } = soccerClockTestHelpers.setup(
              soccerClockTestHelpers.createSoccerClockState({
                currentPeriod: canBeginPeriod,
                currentTimer: timer,
                lastTimeSwitched: now,
              }),
            );
            const oldTimers = store.getState().timers;
            soccerClockActions.beginGame(nextNow)(store.dispatch, store.getState);
            expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.FIRST_HALF);
            expect(store.getState().currentTimer).toBe(SOCCER_CLOCK_TIMER.RUNNING);
            expect(store.getState().lastTimeSwitched).toBe(timeIncrement);
            expect(store.getState().timers).toEqual({
              ...oldTimers,
              [canBeginPeriod]: {
                // causes TS linting error until there are some beginnable periods with timers
                // @ts-ignore
                ...oldTimers[canBeginPeriod],
                [previousTimer]: oldTimers[canBeginPeriod][previousTimer] + timeIncrement,
              },
            });
          });
        });
      } else {
        /**
         * @test
         * periods without timers
         */
        it(`Should begin game in [${canBeginPeriod}]`, () => {
          const now = Date.now();
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: canBeginPeriod,
            }),
          );
          soccerClockActions.beginGame(now)(store.dispatch, store.getState);
          expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.FIRST_HALF);
          expect(store.getState().currentTimer).toBe(SOCCER_CLOCK_TIMER.RUNNING);
          expect(store.getState().lastTimeSwitched).toBe(now);
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
            const { nextNow } = soccerClockTestHelpers.incrementTime(now);
            const { store } = soccerClockTestHelpers.setup(
              soccerClockTestHelpers.createSoccerClockState({
                currentPeriod: cantBeginPeriod,
                currentTimer: timer,
                lastTimeSwitched: now,
              }),
            );
            expect(() => soccerClockActions.beginGame(nextNow)(store.dispatch, store.getState)).toThrowError();
          });
        });
      } else {
        /**
         * @test
         * periods without timers
         */
        it(`Should fail to begin game in [${cantBeginPeriod}]`, () => {
          const now = Date.now();
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: cantBeginPeriod,
            }),
          );
          expect(() => soccerClockActions.beginGame(now)(store.dispatch, store.getState)).toThrowError();
        });
      }
    });

    soccerClockActions;
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
          const { nextNow, timeIncrement } = soccerClockTestHelpers.incrementTime(now);
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: periodWithTimer,
              currentTimer: previousTimer,
              lastTimeSwitched: now,
            }),
          );
          const oldTimers = store.getState().timers;

          soccerClockActions.haltGame(nextNow)(store.dispatch, store.getState);
          expect(store.getState().currentPeriod).toBe(periodWithTimer);
          expect(store.getState().currentTimer).toBe(SOCCER_CLOCK_TIMER.HALTED);
          expect(store.getState().timers).toEqual({
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
        const { store } = soccerClockTestHelpers.setup(
          soccerClockTestHelpers.createSoccerClockState({
            currentPeriod: periodWithoutTimer,
          }),
        );

        expect(() => soccerClockActions.haltGame(now)(store.dispatch, store.getState)).toThrowError();
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
          const { nextNow, timeIncrement } = soccerClockTestHelpers.incrementTime(now);
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: periodWithTimer,
              currentTimer: previousTimer,
              lastTimeSwitched: now,
            }),
          );
          const oldTimers = store.getState().timers;
          soccerClockActions.pauseGame(nextNow)(store.dispatch, store.getState);
          expect(store.getState().currentPeriod).toBe(periodWithTimer);
          expect(store.getState().currentTimer).toBe(SOCCER_CLOCK_TIMER.PAUSED);
          expect(store.getState().timers).toEqual({
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
        const { nextNow } = soccerClockTestHelpers.incrementTime(now);
        const { store } = soccerClockTestHelpers.setup(
          soccerClockTestHelpers.createSoccerClockState({
            currentPeriod: periodWithoutTimer,
          }),
        );

        expect(() => soccerClockActions.pauseGame(nextNow)(store.dispatch, store.getState)).toThrowError();
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
          const { nextNow, timeIncrement } = soccerClockTestHelpers.incrementTime(now);
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: periodWithTimer,
              currentTimer: previousTimer,
              lastTimeSwitched: now,
            }),
          );
          const oldTimers = store.getState().timers;
          soccerClockActions.resumeGame(nextNow)(store.dispatch, store.getState);
          expect(store.getState().currentPeriod).toBe(periodWithTimer);
          expect(store.getState().currentTimer).toBe(SOCCER_CLOCK_TIMER.RUNNING);
          expect(store.getState().timers).toEqual({
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
        const { nextNow } = soccerClockTestHelpers.incrementTime(now);
        const { store } = soccerClockTestHelpers.setup(
          soccerClockTestHelpers.createSoccerClockState({
            currentPeriod: periodWithoutTimer,
          }),
        );

        expect(() => soccerClockActions.resumeGame(nextNow)(store.dispatch, store.getState)).toThrowError();
      });
    });
  });

  /**
   * @description nextPeriod
   */
  describe('nextPeriod', () => {
    let previousNow = Date.now();
    const { store } = soccerClockTestHelpers.setup(
      soccerClockTestHelpers.createSoccerClockState({
        currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
        currentTimer: null,
        lastTimeSwitched: null,
      }),
    );

    soccerClockActions.beginGame(previousNow)(store.dispatch, store.getState);

    let incrementTimeResponse;
    let nextNow;
    let timeIncrement;
    let oldTimers;
    const timer = store.getState().currentTimer;

    expect(timer).not.toBeNull();
    // to make TS not complain below
    if (timer === null) throw new Error('Timer cannot be null while game is running...');

    it(`Should take the state from [${store.getState().currentPeriod}][${store.getState().currentTimer}] to [${
      SOCCER_CLOCK_PERIOD.MID_BREAK
    }]`, () => {
      // first half
      oldTimers = store.getState().timers;
      incrementTimeResponse = soccerClockTestHelpers.incrementTime(previousNow);
      nextNow = incrementTimeResponse.nextNow;
      timeIncrement = incrementTimeResponse.timeIncrement;
      soccerClockActions.nextPeriod(nextNow)(store.dispatch, store.getState);
      expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.MID_BREAK);
      expect(store.getState().currentTimer).toBe(timer);
      expect(store.getState().timers).toEqual({
        ...oldTimers,
        [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
          ...oldTimers[SOCCER_CLOCK_PERIOD.FIRST_HALF],
          [timer]: oldTimers[SOCCER_CLOCK_PERIOD.FIRST_HALF][timer] + timeIncrement,
        },
      });
      previousNow = nextNow;
    });

    it(`Should take the state from [${store.getState().currentPeriod}][${store.getState().currentTimer}] to [${
      SOCCER_CLOCK_PERIOD.SECOND_HALF
    }]`, () => {
      // mid break
      oldTimers = store.getState().timers;
      incrementTimeResponse = soccerClockTestHelpers.incrementTime(previousNow);
      nextNow = incrementTimeResponse.nextNow;
      timeIncrement = incrementTimeResponse.timeIncrement;
      soccerClockActions.nextPeriod(nextNow)(store.dispatch, store.getState);
      expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.SECOND_HALF);
      expect(store.getState().currentTimer).toBe(timer);
      expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.SECOND_HALF);
      expect(store.getState().timers).toEqual({
        ...oldTimers,
        [SOCCER_CLOCK_PERIOD.MID_BREAK]: {
          ...oldTimers[SOCCER_CLOCK_PERIOD.MID_BREAK],
          [timer]: oldTimers[SOCCER_CLOCK_PERIOD.MID_BREAK][timer] + timeIncrement,
        },
      });
      previousNow = nextNow;
    });

    it(`Should take the state from [${store.getState().currentPeriod}][${store.getState().currentTimer}] to [${
      SOCCER_CLOCK_PERIOD.GAME_OVER
    }]`, () => {
      // mid break
      oldTimers = store.getState().timers;
      incrementTimeResponse = soccerClockTestHelpers.incrementTime(previousNow);
      nextNow = incrementTimeResponse.nextNow;
      timeIncrement = incrementTimeResponse.timeIncrement;
      soccerClockActions.nextPeriod(nextNow)(store.dispatch, store.getState);
      expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.GAME_OVER);
      expect(store.getState().currentTimer).toBeNull();
      expect(store.getState().timers).toEqual({
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
