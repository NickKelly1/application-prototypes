import {
  SingleSoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SoccerClockState,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_CAN_BEGIN_PERIODS,
  SOCCER_CLOCK_ALL_TIMERS,
  SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS,
} from './soccer-clock-state';
import { createStore } from '../../../lib/store/store';
import { soccerClockReducer } from './soccer-clock-reducer';
import { SOCCER_CLOCK_ACTION_NAMES } from './soccer-clock-actions';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { ValueFrom } from '../../../../@types/helpers';
import { inThisButNotThat } from '../../../helpers/in-this-but-not-that';
import { soccerClockTestHelpers } from './_soccer-clock-test-helpers.test';

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
    // soccerClockTestHelpers.setup
    const now = Date.now();
    const validPeriods = SOCCER_CLOCK_CAN_BEGIN_PERIODS;
    const invalidPeriods = inThisButNotThat(Object.values(SOCCER_CLOCK_PERIOD), validPeriods);

    validPeriods.forEach(validPeriod => {
      const { store } = soccerClockTestHelpers.setup(
        soccerClockTestHelpers.soccerClockStateFactory({ currentPeriod: validPeriod }),
      );
      store.dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } });
      expect(store.getState().currentPeriod).toEqual(SOCCER_CLOCK_PERIOD.FIRST_HALF);
      expect(store.getState().currentTimer).toEqual(SOCCER_CLOCK_TIMER.RUNNING);
      expect(store.getState().lastTimeSwitched).toEqual(now);
    });

    invalidPeriods.forEach(invalidPeriod => {
      const { store } = soccerClockTestHelpers.setup(
        soccerClockTestHelpers.soccerClockStateFactory({ currentPeriod: invalidPeriod }),
      );
      expect(() => store.dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } })).toThrowError();
    });
  });

  /**
   * @test
   * DESCRIBE Action SWITCH_PERIOD
   */
  describe(`Action "${SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD}"`, () => {
    const now = Date.now();

    /**
     * @description
     * Periods with timers
     */
    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(previousPeriodWithTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
        SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(nextPeriodWithTimer => {
          SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
            it(`Should transition FROM -> [${previousPeriodWithTimer}][${previousTimer}] -> TO -> [${nextPeriodWithTimer}][${nextTimer}]`, () => {
              const { store } = soccerClockTestHelpers.setup(
                soccerClockTestHelpers.soccerClockStateFactory({
                  currentPeriod: previousPeriodWithTimer,
                  currentTimer: previousTimer,
                  lastTimeSwitched: now,
                }),
              );
              const { timeIncrement, nextNow } = soccerClockTestHelpers.incrementTime(now);
              store.dispatch({
                type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
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

        // periods with timers -> period without timer
        SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(nextPeriodWithoutTimer =>
          it(`Should transition FROM -> [${previousPeriodWithTimer}][${previousTimer}] -> TO -> [${nextPeriodWithoutTimer}]`, () => {
            const { store } = soccerClockTestHelpers.setup(
              soccerClockTestHelpers.soccerClockStateFactory({
                currentPeriod: previousPeriodWithTimer,
                currentTimer: previousTimer,
                lastTimeSwitched: now,
              }),
            );
            const { timeIncrement, nextNow } = incrementTime(now);
            store.dispatch({
              type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
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
     * Periods without timers
     */
    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(previousPeriodWithoutTimer => {
      SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(nextPeriodWithTimer => {
        SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
          it(`Should transition FROM -> [${previousPeriodWithoutTimer}] -> TO -> [${nextPeriodWithTimer}][${nextTimer}]`, () => {
            const { store } = soccerClockTestHelpers.setup(
              soccerClockTestHelpers.soccerClockStateFactory({
                currentPeriod: previousPeriodWithoutTimer,
                lastTimeSwitched: now,
              }),
            );
            const { nextNow } = incrementTime(now);
            store.dispatch({
              type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
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

      // periods with timers -> period without timer
      SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(nextPeriodWithoutTimer =>
        it(`Should transition FROM -> [${previousPeriodWithoutTimer}] -> TO -> [${nextPeriodWithoutTimer}]`, () => {
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.soccerClockStateFactory({
              currentPeriod: previousPeriodWithoutTimer,
              lastTimeSwitched: now,
            }),
          );
          const { nextNow } = incrementTime(now);
          store.dispatch({
            type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
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

  describe(`Action "${SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER}"`, () => {
    const now = Date.now();

    SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(currentPeriodWithTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
        SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
          it(`Should transition IN [${currentPeriodWithTimer}] FROM -> [${previousTimer}] -> TO -> [${nextTimer}]`, () => {
            const { store } = soccerClockTestHelpers.setup(
              soccerClockTestHelpers.soccerClockStateFactory({
                currentPeriod: currentPeriodWithTimer,
                currentTimer: previousTimer,
                lastTimeSwitched: now,
              }),
            );

            const { nextNow, timeIncrement } = incrementTime(now);

            store.dispatch({
              type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER,
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

    SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(currentPeriodWithoutTimer => {
      SOCCER_CLOCK_ALL_TIMERS.forEach(nextTimer => {
        it(`Should cause no transition IN [${currentPeriodWithoutTimer}]`, () => {
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.soccerClockStateFactory({
              currentPeriod: currentPeriodWithoutTimer,
            }),
          );

          const { nextNow } = incrementTime(now);

          const initialState = store.getState();
          store.dispatch({
            type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER,
            payload: { nextTimer, now: nextNow },
          });

          expect(store.getState()).toEqual(initialState);
          SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(period => {
            SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
              expect(store.getState().timers[period][timer]).toBe(0);
            });
          });
        });
      });
    });
  });
});