import {
  SingleSoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SoccerClockState,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_CAN_BEGIN_PERIODS,
} from './soccer-clock-state';
import { createStore } from '../../../lib/store/store';
import { soccerClockReducer } from './soccer-clock-reducer';
import { soccerClockActions, SOCCER_CLOCK_ACTION_NAMES, SoccerClockActionTypes } from './soccer-clock-actions';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { tupleIncludes } from '../../../helpers/tuple-includes';
import { ValueFrom, ElementOf } from '../../../../@types/helpers';
import { inThisButNotThat } from '../../../helpers/in-this-but-not-that';

const MAX_TIME_INCREMENT = 10_000; // 10 seconds

const incrementTime = (now: number) => {
  const timeIncrement = Math.floor(MAX_TIME_INCREMENT * Math.random()) + 1;
  const nextNow = now + timeIncrement;
  return { timeIncrement, nextNow };
};

// TODO make input throw compile error if not matching one of the potential inputs below
// (e.g. if you supply timer, you must also supply lastTimeSwitched)
const setup = (
  input:
    | {}
    | {
        period: ValueFrom<SOCCER_CLOCK_PERIOD>;
      }
    | {
        period: ValueFrom<SOCCER_CLOCK_PERIOD>;
        timer: null | ValueFrom<SOCCER_CLOCK_TIMER>;
        lastTimeSwitched: null | number;
      } = {},
) => {
  const initialState: SingleSoccerClockState = {
    currentPeriod: 'period' in input ? input.period : SOCCER_CLOCK_PERIOD.NOT_STARTED,
    currentTimer: 'timer' in input ? input.timer : null,
    lastTimeSwitched: 'lastTimeSwitched' in input ? input.lastTimeSwitched : null,
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
  };

  const store = createStore<SoccerClockState, SoccerGameActionTypes>(initialState, [soccerClockReducer]);

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
      const { store } = setup({ period: validPeriod });
      store.dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } });
      expect(store.getState().currentPeriod).toEqual(SOCCER_CLOCK_PERIOD.FIRST_HALF);
      expect(store.getState().currentTimer).toEqual(SOCCER_CLOCK_TIMER.RUNNING);
      expect(store.getState().lastTimeSwitched).toEqual(now);
    });

    invalidPeriods.forEach(invalidPeriod => {
      const { store } = setup({ period: invalidPeriod });
      expect(() => store.dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } })).toThrowError();
    });
  });

  /**
   * @test
   * DESCRIBE Action SWITCH_PERIOD
   */
  describe(`action "${SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD}"`, () => {
    const now = Date.now();

    const allPeriods = Object.values(SOCCER_CLOCK_PERIOD);
    type allPeriods = typeof allPeriods;

    const untransitionablePeriods = [SOCCER_CLOCK_PERIOD.NOT_STARTED];
    type untransitionablePeriods = typeof untransitionablePeriods;

    const transitionablePeriods = inThisButNotThat(allPeriods, untransitionablePeriods);
    type transitionablePeriods = typeof transitionablePeriods;

    const timers = Object.values(SOCCER_CLOCK_TIMER);
    type timers = typeof timers;

    const periodsWithTimers = SOCCER_CLOCK_PERIODS_WITH_TIMERS;
    type periodsWithTimers = typeof SOCCER_CLOCK_PERIODS_WITH_TIMERS;

    // @note: assume all periods with timers are transitionable
    const transitionablePeriodsWithTimers = periodsWithTimers;
    type transitionablePeriodsWithTimers = typeof transitionablePeriodsWithTimers;

    const transitionablePeriodsWithoutTimers = inThisButNotThat(transitionablePeriods, transitionablePeriodsWithTimers);
    type transitionablePeriodsWithoutTimers = typeof transitionablePeriodsWithoutTimers;

    /**
     * @description
     * Periods with timers
     */
    transitionablePeriodsWithTimers.forEach(previousPeriodWithTimer => {
      timers.forEach(previousTimer => {
        transitionablePeriodsWithTimers.forEach(nextPeriodWithTimer => {
          timers.forEach(nextTimer => {
            describe(`transition [FROM] ["${previousPeriodWithTimer}"]["${previousTimer}"] [TO] ["${nextPeriodWithTimer}"]["${nextTimer}"]`, () => {
              const { store } = setup({
                period: previousPeriodWithTimer,
                timer: previousTimer,
                lastTimeSwitched: now,
              });
              const { timeIncrement, nextNow } = incrementTime(now);
              store.dispatch({
                type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
                payload: { nextPeriod: nextPeriodWithTimer, now: nextNow, nextTimer },
              });

              it(`should transition to period ["${nextPeriodWithTimer}"]`, () =>
                expect(store.getState().currentPeriod).toBe(nextPeriodWithTimer));

              it(`should transition to timer "${nextTimer}"`, () =>
                expect(store.getState().currentTimer).toBe(nextTimer));

              it(`should change "[${previousPeriodWithTimer}][${previousTimer}]" by delta "${timeIncrement}"`, () =>
                expect(store.getState().timers[previousPeriodWithTimer][previousTimer]).toEqual(timeIncrement));

              periodsWithTimers.forEach(period =>
                timers.forEach(timer => {
                  if (!(period === previousPeriodWithTimer && previousTimer === timer)) {
                    it(`should NOT change "[${period}][${timer}]"`, () => {
                      expect(store.getState().timers[period][timer]).toEqual(0);
                    });
                  }
                }),
              );
            });
          });
        });

        // periods with timers -> period without timer
        transitionablePeriodsWithoutTimers.forEach(nextPeriodWithoutTimer =>
          describe(`transition [FROM] ["${previousPeriodWithTimer}"]["${previousTimer}"] [TO] ["${nextPeriodWithoutTimer}"]`, () => {
            const { store } = setup({
              period: previousPeriodWithTimer,
              timer: previousTimer,
              lastTimeSwitched: now,
            });
            const { timeIncrement, nextNow } = incrementTime(now);
            store.dispatch({
              type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
              payload: { nextPeriod: nextPeriodWithoutTimer, now: nextNow },
            });

            it(`should transition to period "[${nextPeriodWithoutTimer}]"`, () =>
              expect(store.getState().currentPeriod).toBe(nextPeriodWithoutTimer));

            it(`should transition to null timer`, () => expect(store.getState().currentTimer).toBe(null));

            it(`should increment "[${previousPeriodWithTimer}][${previousTimer}]" by "${timeIncrement}"`, () =>
              expect(store.getState().timers[previousPeriodWithTimer][previousTimer]).toEqual(timeIncrement));

            periodsWithTimers.forEach(period =>
              timers.forEach(timer => {
                if (!(period === previousPeriodWithTimer && previousTimer === timer)) {
                  it(`should NOT change "[${period}][${timer}]"`, () => {
                    expect(store.getState().timers[period][timer]).toEqual(0);
                  });
                }
              }),
            );
          }),
        );

        // periods with timers -> invalid periods
        untransitionablePeriods.forEach(untransitionablePeriod =>
          describe(`transition [FROM] ["${previousPeriodWithTimer}"]["${previousTimer}"] [TO] (invalid) ["${untransitionablePeriod}"]`, () => {
            const { store } = setup({
              period: previousPeriodWithTimer,
              timer: previousTimer,
              lastTimeSwitched: now,
            });
            const { nextNow } = incrementTime(now);

            it(`should throw error trying to transition to "[${untransitionablePeriod}]"`, () => {
              expect(() => {
                store.dispatch({
                  type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
                  // @ts-ignore
                  payload: { nextPeriod: untransitionablePeriod, now: nextNow },
                });
              }).toThrowError();
            });
          }),
        );
      });
    });

    /**
     * @description
     * Periods without timers
     */
    transitionablePeriodsWithoutTimers.forEach(previousPeriodWithoutTimer => {
      transitionablePeriodsWithTimers.forEach(nextPeriodWithTimer => {
        timers.forEach(nextTimer => {
          describe(`transition [FROM] ["${previousPeriodWithoutTimer}"] [TO] ["${nextPeriodWithTimer}"]["${nextTimer}"]`, () => {
            const { store } = setup({
              period: previousPeriodWithoutTimer,
              lastTimeSwitched: now,
            });
            const { timeIncrement, nextNow } = incrementTime(now);
            store.dispatch({
              type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
              payload: { nextPeriod: nextPeriodWithTimer, now: nextNow, nextTimer },
            });

            it(`should transition to period "[${nextPeriodWithTimer}]"`, () =>
              expect(store.getState().currentPeriod).toBe(nextPeriodWithTimer));

            it(`should transition to timer "${nextTimer}"`, () =>
              expect(store.getState().currentTimer).toBe(nextTimer));

            periodsWithTimers.forEach(period =>
              timers.forEach(timer => {
                it(`should NOT change "[${period}][${timer}]"`, () => {
                  expect(store.getState().timers[period][timer]).toEqual(0);
                });
              }),
            );
          });
        });
      });

      // periods with timers -> period without timer
      transitionablePeriodsWithoutTimers.forEach(nextPeriodWithoutTimer =>
        describe(`transition [FROM] ["${previousPeriodWithoutTimer}"] [TO] ["${nextPeriodWithoutTimer}"]`, () => {
          const { store } = setup({
            period: previousPeriodWithoutTimer,
            lastTimeSwitched: now,
          });
          const { nextNow } = incrementTime(now);
          store.dispatch({
            type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
            payload: { nextPeriod: nextPeriodWithoutTimer, now: nextNow },
          });

          it(`should transition to period "[${nextPeriodWithoutTimer}]"`, () =>
            expect(store.getState().currentPeriod).toBe(nextPeriodWithoutTimer));

          it(`should transition to null timer`, () => expect(store.getState().currentTimer).toBe(null));

          periodsWithTimers.forEach(period =>
            timers.forEach(timer => {
              it(`should NOT change "[${period}][${timer}]"`, () => {
                expect(store.getState().timers[period][timer]).toEqual(0);
              });
            }),
          );
        }),
      );

      // periods with timers -> invalid periods
      untransitionablePeriods.forEach(untransitionablePeriod =>
        describe(`transition [FROM] ["${previousPeriodWithoutTimer}"] [TO] (invalid) ["${untransitionablePeriod}"]`, () => {
          const { store } = setup({
            period: previousPeriodWithoutTimer,
            lastTimeSwitched: now,
          });
          const { nextNow } = incrementTime(now);

          it(`should throw error trying to transition to "[${untransitionablePeriod}]"`, () => {
            expect(() => {
              store.dispatch({
                type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
                // @ts-ignore
                payload: { nextPeriod: untransitionablePeriod, now: nextNow },
              });
            }).toThrowError();
          });
        }),
      );
    });

    /**
     * @description
     * invalid periods
     */
    untransitionablePeriods.forEach(untransitionablePeriod => {
      transitionablePeriodsWithTimers.forEach(nextPeriodWithTimer => {
        timers.forEach(nextTimer => {
          describe(`transition [FROM] (invalid) ["${untransitionablePeriod}"] [TO] ["${nextPeriodWithTimer}"]["${nextTimer}"]`, () => {
            const { store } = setup({
              period: untransitionablePeriod,
              lastTimeSwitched: now,
            });
            const { nextNow } = incrementTime(now);

            it(`should throw error trying to transition from (invalid) ["${untransitionablePeriod}"] to ["${nextPeriodWithTimer}"]["${nextTimer}"]`, () => {
              expect(() => {
                store.dispatch({
                  type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
                  payload: { nextPeriod: nextPeriodWithTimer, now: nextNow, nextTimer },
                });
              }).toThrowError();
            });
          });
        });
      });

      // periods with timers -> period without timer
      transitionablePeriodsWithoutTimers.forEach(nextPeriodWithoutTimer =>
        describe(`transition [FROM] (invalid) ["${untransitionablePeriod}"] [TO] ["${nextPeriodWithoutTimer}"]`, () => {
          const { store } = setup({
            period: untransitionablePeriod,
            lastTimeSwitched: now,
          });
          const { nextNow } = incrementTime(now);

          it(`should throw error trying to transition from "[${untransitionablePeriod}]" to ["${nextPeriodWithoutTimer}"]`, () => {
            expect(() => {
              store.dispatch({
                type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
                payload: { nextPeriod: nextPeriodWithoutTimer, now: nextNow },
              });
            }).toThrowError();
          });
        }),
      );

      // periods with timers -> invalid periods
      untransitionablePeriods.forEach(untransitionablePeriod =>
        describe(`transition [FROM] (invalid) ["${untransitionablePeriod}"] [TO] (invalid) ["${untransitionablePeriod}"]`, () => {
          const { store } = setup({
            period: untransitionablePeriod,
            lastTimeSwitched: now,
          });
          const { nextNow } = incrementTime(now);

          it(`should throw error trying to transition to "[${untransitionablePeriod}]"`, () => {
            expect(() => {
              store.dispatch({
                type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
                // @ts-ignore
                payload: { nextPeriod: untransitionablePeriod, now: nextNow },
              });
            }).toThrowError();
          });
        }),
      );
    });
  });
});
