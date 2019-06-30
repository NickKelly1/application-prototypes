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

describe('Soccer Clock State', () => {
  /**
   * @test
   * should begin when possible
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
   * should switch periods when possible
   */
  it('switch periods where possible', () => {
    const now = Date.now();

    const allPeriods = Object.values(SOCCER_CLOCK_PERIOD);
    const untransitionablePeriods = [SOCCER_CLOCK_PERIOD.NOT_STARTED];
    const transitionablePeriods = inThisButNotThat(allPeriods, untransitionablePeriods);
    const timers = Object.values(SOCCER_CLOCK_TIMER);

    // @note: assume all periods with timers are transitionable
    const transitionablePeriodsWithTimers = SOCCER_CLOCK_PERIODS_WITH_TIMERS;
    const transitionablePeriodsWithoutTimers = inThisButNotThat(transitionablePeriods, transitionablePeriodsWithTimers);

    // periods with timers
    transitionablePeriodsWithTimers.forEach(previousPeriodWithTimer => {
      timers.forEach(previousTimer => {
        transitionablePeriodsWithTimers.forEach(nextPeriodWithTimer => {
          // periods with timers -> period with timer
          timers.forEach(nextTimer => {
            const { store } = setup({ period: previousPeriodWithTimer, timer: previousTimer, lastTimeSwitched: now });
            const { timeIncrement, nextNow } = incrementTime(now);
            store.dispatch({
              type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
              payload: { nextPeriod: nextPeriodWithTimer, now: nextNow, nextTimer },
            });

            //
            expect(store.getState().currentPeriod).toBe(nextPeriodWithTimer);

            // assert all timers for next state to be zero
            if (previousPeriodWithTimer !== nextPeriodWithTimer)
              timers.forEach(timer => expect(store.getState().timers[nextPeriodWithTimer][timer]).toEqual(0));
            // assert only the incremented timer to be zero
            else if (previousPeriodWithTimer === nextPeriodWithTimer)
              timers.forEach(timer =>
                expect(store.getState().timers[previousPeriodWithTimer][timer]).toEqual(
                  timer === previousTimer ? timeIncrement : 0,
                ),
              );
          });
        });

        // periods with timers -> period without timer
        transitionablePeriodsWithoutTimers.forEach(nextPeriodWithoutTimer => {
          const { store } = setup({ period: previousPeriodWithTimer, timer: previousTimer, lastTimeSwitched: now });
          store.dispatch({
            type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
            payload: { nextPeriod: nextPeriodWithoutTimer, now },
          });
          expect(store.getState().timers[previousPeriodWithTimer][previousTimer]).toBe(timeIncrement);
          expect(store.getState().currentPeriod).toBe(nextPeriodWithTimer);
        });

        // periods with timers -> invalid periods
        untransitionablePeriods.forEach(untransitionablePeriod => {
          const { store } = setup({ period: previousPeriodWithTimer, timer: previousTimer, lastTimeSwitched: now });
          expect(() =>
            store.dispatch({
              type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
              // @ts-ignore
              payload: { nextPeriod: untransitionablePeriod, now },
            }),
          ).toThrowError();
        });
      });
    });

    // // periods without timers
    // transitionablePeriodsWithoutTimers.forEach(previousPeriodWithoutTimer => {
    //   transitionablePeriodsWithTimers.forEach(nextPeriodWithTimer => {
    //     // periods without -> period with timer
    //     timers.forEach(nextTimer => {
    //       const { store } = setup({ period: previousPeriodWithoutTimer });
    //       store.dispatch({
    //         type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
    //         payload: { nextPeriod: nextPeriodWithTimer, now, nextTimer },
    //       });
    //     });
    //   });

    //   // periods without -> period without timer
    //   transitionablePeriodsWithoutTimers.forEach(nextPeriodWithoutTimer => {
    //     const { store } = setup({ period: previousPeriodWithoutTimer });
    //     store.dispatch({
    //       type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
    //       payload: { nextPeriod: nextPeriodWithoutTimer, now },
    //     });
    //   });

    //   // periods with timers -> invalid periods
    //   untransitionablePeriods.forEach(nextInvalidPeriod => {
    //     const { store } = setup({ period: previousPeriodWithoutTimer });
    //     expect(() =>
    //       store.dispatch({
    //         type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
    //         // @ts-ignore
    //         payload: { nextPeriod: nextInvalidPeriod, now },
    //       }),
    //     ).toThrowError();
    //   });
    // });

    // // untransitionable periods
    // untransitionablePeriods.forEach(previousInvalidPeriod => {
    //   transitionablePeriodsWithTimers.forEach(nextPeriodWithTimer => {
    //     // invalid period -> period with timer
    //     timers.forEach(nextTimer => {
    //       const { store } = setup({ period: previousInvalidPeriod });
    //       expect(() => {
    //         store.dispatch({
    //           type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
    //           payload: { nextPeriod: nextPeriodWithTimer, now, nextTimer },
    //         });
    //       }).toThrowError();
    //     });
    //   });

    //   // invalid period -> period without timer
    //   transitionablePeriodsWithoutTimers.forEach(nextPeriodWithoutTimer => {
    //     const { store } = setup({ period: previousInvalidPeriod });
    //     expect(() => {
    //       store.dispatch({
    //         type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
    //         payload: { nextPeriod: nextPeriodWithoutTimer, now },
    //       });
    //     }).toThrowError();
    //   });

    //   // invalid period -> invalid periods
    //   untransitionablePeriods.forEach(nextInvalidPeriod => {
    //     const { store } = setup({ period: previousInvalidPeriod });
    //     expect(() =>
    //       store.dispatch({
    //         type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
    //         // @ts-ignore
    //         payload: { nextPeriod: nextInvalidPeriod, now },
    //       }),
    //     ).toThrowError();
    //   });
    // });
  });
});
