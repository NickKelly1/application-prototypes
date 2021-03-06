import {
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_CAN_BEGIN_PERIODS,
  SOCCER_CLOCK_ALL_TIMERS,
  SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS,
  SOCCER_CLOCK_ALL_PERIODS,
  SoccerClockState,
} from './soccer-clock-state';
import { inThisButNotThat } from '../../../helpers/in-this-but-not-that';
import { tupleIncludes } from '../../../helpers/tuple-includes';
import { ElementOf } from '../../../../@types/helpers';
import { SOCCER_EVENT, SoccerEventPayloads } from '../soccer-events';
import { createStore } from '../../../lib/store/store';
import { soccerClockReducer } from './soccer-clock-reducer';
import { soccerTestHelpers } from '../soccer-test-helpers.test';

/**
 * @description
 * Setup for tests
 *
 * @param initialState
 */
const setup = (initialState = soccerTestHelpers.createSoccerClockTestState()) => {
  const store = createStore<SoccerClockState, SoccerEventPayloads>(initialState, [soccerClockReducer]);

  return {
    initialState,
    store,
  };
};

/**
 * @test
 * DESCRIBE Soccer Clock State
 */
describe('Soccer Clock State', () => {
  /**
   * @test
   * IT should begin when possible
   */
  it('should begin when possible', () => {
    // setup
    const now = Date.now();
    const validPeriods = SOCCER_CLOCK_CAN_BEGIN_PERIODS;
    const invalidPeriods = inThisButNotThat(Object.values(SOCCER_CLOCK_PERIOD), validPeriods);

    validPeriods.forEach(validPeriod => {
      const { store } = setup(
        soccerTestHelpers.createSoccerClockTestState({
          currentPeriod: validPeriod,
        }),
      );
      store.dispatch({ type: SOCCER_EVENT.BEGIN_GAME, payload: { now } });
      expect(store.getState().currentPeriod).toEqual(SOCCER_CLOCK_PERIOD.FIRST_HALF);
      expect(store.getState().currentTimer).toEqual(SOCCER_CLOCK_TIMER.RUNNING);
      expect(store.getState().lastTimeSwitched).toEqual(now);
    });

    /**
     * @description
     * Tries to "begin" for invalid states
     *
     * @param invalidPeriod
     * @param timer
     * @param lastTimeSwitched
     */
    const invalidBeginTests = <P extends ElementOf<SOCCER_CLOCK_ALL_PERIODS>>(
      invalidPeriod: P,
      timer: P extends ElementOf<SOCCER_CLOCK_PERIODS_WITH_TIMERS> ? ElementOf<SOCCER_CLOCK_ALL_TIMERS> : undefined,
      lastTimeSwitched: P extends ElementOf<SOCCER_CLOCK_PERIODS_WITH_TIMERS> ? number : undefined,
    ) => {
      // TODO: get types working so they don't have to be hard coded
      const stateArguments = !tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, invalidPeriod)
        ? { currentPeriod: invalidPeriod as ElementOf<SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS> }
        : {
            currentPeriod: invalidPeriod as ElementOf<SOCCER_CLOCK_PERIODS_WITH_TIMERS>,
            currentTimer: timer as ElementOf<SOCCER_CLOCK_ALL_TIMERS>,
            lastTimeSwitched: lastTimeSwitched as number,
          };

      const { store } = setup(soccerTestHelpers.createSoccerClockTestState(stateArguments));
      expect(() => store.dispatch({ type: SOCCER_EVENT.BEGIN_GAME, payload: { now } })).toThrowError();
    };

    // fire invalidBeginTests
    invalidPeriods.forEach(invalidPeriod => {
      if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, invalidPeriod)) {
        SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
          invalidBeginTests(invalidPeriod, timer, soccerTestHelpers.incrementTime(now).nextNow);
        });
      } else {
        invalidBeginTests(invalidPeriod, undefined, undefined);
      }
    });
  });

  /**
   * @description
   * DESCRIBE Action SWITCH_CLOCK_PERIOD
   */
  describe(`Action "${SOCCER_EVENT.SWITCH_CLOCK_PERIOD}"`, () => {
    const now = Date.now();

    /**
     * @description
     * Periods with timers ->
     */
    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(previousPeriodWithTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
        /**
         * -> periods with timers
         */
        SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(nextPeriodWithTimer => {
          SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
            it(`Should transition FROM -> [${previousPeriodWithTimer}][${previousTimer}] -> TO -> [${nextPeriodWithTimer}][${nextTimer}]`, () => {
              const { store } = setup(
                soccerTestHelpers.createSoccerClockTestState({
                  currentPeriod: previousPeriodWithTimer,
                  currentTimer: previousTimer,
                  lastTimeSwitched: now,
                }),
              );
              const { timeIncrement, nextNow } = soccerTestHelpers.incrementTime(now);
              store.dispatch({
                type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
                payload: { nextPeriod: nextPeriodWithTimer, now: nextNow, nextTimer },
              });

              expect(store.getState().currentPeriod).toBe(nextPeriodWithTimer);
              expect(store.getState().currentTimer).toBe(nextTimer);
              expect(store.getState().timers[previousPeriodWithTimer][previousTimer]).toEqual(timeIncrement);

              SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(period =>
                SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
                  if (!(period === previousPeriodWithTimer && previousTimer === timer)) {
                    expect(store.getState().timers[period][timer]).toEqual(0);
                  }
                }),
              );
            });
          });
        });

        /**
         * @test
         * -> periods without timers
         */
        SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(nextPeriodWithoutTimer =>
          it(`Should transition FROM -> [${previousPeriodWithTimer}][${previousTimer}] -> TO -> [${nextPeriodWithoutTimer}]`, () => {
            const { store } = setup(
              soccerTestHelpers.createSoccerClockTestState({
                currentPeriod: previousPeriodWithTimer,
                currentTimer: previousTimer,
                lastTimeSwitched: now,
              }),
            );
            const { timeIncrement, nextNow } = soccerTestHelpers.incrementTime(now);
            store.dispatch({
              type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
              payload: { nextPeriod: nextPeriodWithoutTimer, now: nextNow },
            });

            expect(store.getState().currentPeriod).toBe(nextPeriodWithoutTimer);
            expect(store.getState().currentTimer).toBe(null);
            expect(store.getState().timers[previousPeriodWithTimer][previousTimer]).toEqual(timeIncrement);

            SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(period =>
              SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
                if (!(period === previousPeriodWithTimer && previousTimer === timer)) {
                  expect(store.getState().timers[period][timer]).toEqual(0);
                }
              }),
            );
          }),
        );
      });
    });

    /**
     * @description
     * Periods without timers ->
     */
    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(previousPeriodWithoutTimer => {
      /**
       * @test
       * -> periods with timers
       */
      SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(nextPeriodWithTimer => {
        SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
          it(`Should transition FROM -> [${previousPeriodWithoutTimer}] -> TO -> [${nextPeriodWithTimer}][${nextTimer}]`, () => {
            const { store } = setup(
              soccerTestHelpers.createSoccerClockTestState({
                currentPeriod: previousPeriodWithoutTimer,
              }),
            );
            const { nextNow } = soccerTestHelpers.incrementTime(now);
            store.dispatch({
              type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
              payload: { nextPeriod: nextPeriodWithTimer, now: nextNow, nextTimer },
            });

            expect(store.getState().currentPeriod).toBe(nextPeriodWithTimer);
            expect(store.getState().currentTimer).toBe(nextTimer);

            SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(period =>
              SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
                expect(store.getState().timers[period][timer]).toEqual(0);
              }),
            );
          });
        });
      });

      /**
       * @test
       * -> periods without timers
       */
      SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(nextPeriodWithoutTimer =>
        it(`Should transition FROM -> [${previousPeriodWithoutTimer}] -> TO -> [${nextPeriodWithoutTimer}]`, () => {
          const { store } = setup(
            soccerTestHelpers.createSoccerClockTestState({
              currentPeriod: previousPeriodWithoutTimer,
            }),
          );
          const { nextNow } = soccerTestHelpers.incrementTime(now);
          store.dispatch({
            type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
            payload: { nextPeriod: nextPeriodWithoutTimer, now: nextNow },
          });

          expect(store.getState().currentPeriod).toBe(nextPeriodWithoutTimer);
          expect(store.getState().currentTimer).toBe(null);

          SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(period =>
            SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
              expect(store.getState().timers[period][timer]).toEqual(0);
            }),
          );
        }),
      );
    });
  });

  describe(`Action "${SOCCER_EVENT.SWITCH_CLOCK_TIMER}"`, () => {
    const now = Date.now();

    /**
     * @test
     * Periods with timers
     */
    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(currentPeriodWithTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
        SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
          it(`Should transition IN [${currentPeriodWithTimer}] FROM -> [${previousTimer}] -> TO -> [${nextTimer}]`, () => {
            const { store } = setup(
              soccerTestHelpers.createSoccerClockTestState({
                currentPeriod: currentPeriodWithTimer,
                currentTimer: previousTimer,
                lastTimeSwitched: now,
              }),
            );

            const { nextNow, timeIncrement } = soccerTestHelpers.incrementTime(now);

            store.dispatch({
              type: SOCCER_EVENT.SWITCH_CLOCK_TIMER,
              payload: { nextTimer, now: nextNow },
            });

            expect(store.getState().currentPeriod).toBe(currentPeriodWithTimer);
            expect(store.getState().currentTimer).toBe(nextTimer);
            expect(store.getState().timers[currentPeriodWithTimer][previousTimer]).toBe(timeIncrement);
            SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(period => {
              SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
                if (period !== currentPeriodWithTimer && timer !== previousTimer) {
                  expect(store.getState().timers[period][timer]).toBe(0);
                }
              });
            });
          });
        });
      });
    });

    /**
     * @test
     * Periods without timers
     */
    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(currentPeriodWithoutTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
        it(`Should fail to transition IN [${currentPeriodWithoutTimer}]`, () => {
          const { store } = setup(
            soccerTestHelpers.createSoccerClockTestState({
              currentPeriod: currentPeriodWithoutTimer,
            }),
          );
          const { nextNow } = soccerTestHelpers.incrementTime(now);

          expect(() => {
            store.dispatch({
              type: SOCCER_EVENT.SWITCH_CLOCK_TIMER,
              payload: { nextTimer, now: nextNow },
            });
          }).toThrowError();
        });
      });
    });
  });
});
