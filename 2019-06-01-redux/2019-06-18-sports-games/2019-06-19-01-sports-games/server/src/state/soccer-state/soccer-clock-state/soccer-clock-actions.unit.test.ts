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
  describe('newGame', () => {
    const { store } = soccerClockTestHelpers.setup();
    const now = Date.now();

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

  describe('beginGame', () => {
    it('can be fired', () => {
      const now = Date.now();
      inThisAndThat(SOCCER_CLOCK_ALL_PERIODS, SOCCER_CLOCK_CAN_BEGIN_PERIODS).forEach(canBeginPeriod => {
        // can begin
        if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, canBeginPeriod)) {
          // periods with timers
          const now = Date.now();
          SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
            const { store } = soccerClockTestHelpers.setup(
              soccerClockTestHelpers.createSoccerClockState({
                currentPeriod: canBeginPeriod,
                currentTimer: timer,
                lastTimeSwitched: now,
              }),
            );
            soccerClockActions.beginGame(now)(store.dispatch, store.getState);
            expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.FIRST_HALF);
            expect(store.getState().currentTimer).toBe(SOCCER_CLOCK_TIMER.RUNNING);
            expect(store.getState().lastTimeSwitched).toBe(now);
          });
        } else {
          // periods without timers
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
        }
      });

      // can't begin
      inThisButNotThat(SOCCER_CLOCK_ALL_PERIODS, SOCCER_CLOCK_CAN_BEGIN_PERIODS).forEach(cantBeginPeriod => {
        if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, cantBeginPeriod)) {
          // periods with timers
          const now = Date.now();
          const { nextNow } = soccerClockTestHelpers.incrementTime(now);
          SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
            const { store } = soccerClockTestHelpers.setup(
              soccerClockTestHelpers.createSoccerClockState({
                currentPeriod: cantBeginPeriod,
                currentTimer: timer,
                lastTimeSwitched: nextNow,
              }),
            );
            expect(() => soccerClockActions.beginGame(now)(store.dispatch, store.getState)).toThrowError();
          });
        } else {
          // periods without timers
          const now = Date.now();
          const { nextNow } = soccerClockTestHelpers.incrementTime(now);
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: cantBeginPeriod,
            }),
          );
          expect(() => soccerClockActions.beginGame(now)(store.dispatch, store.getState)).toThrowError();
        }
      });

      soccerClockActions;
    });
  });

  describe('haltGame', () => {
    it('can be fired', () => {
      SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(periodWithTimer => {
        SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
          const now = Date.now();
          const { nextNow, timeIncrement } = soccerClockTestHelpers.incrementTime(now);
          const { store } = soccerClockTestHelpers.setup(
            soccerClockTestHelpers.createSoccerClockState({
              currentPeriod: periodWithTimer,
              currentTimer: previousTimer,
              lastTimeSwitched: nextNow,
            }),
          );
          const oldTimers = store.getState().timers;

          soccerClockActions.haltGame(nextNow)(store.dispatch, store.getState);
          expect(store.getState().currentPeriod).toBe(periodWithTimer);
          expect(store.getState().currentTimer).toBe(SOCCER_CLOCK_TIMER.HALTED);
          expect(store.getState().timers).toEqual({
            ...oldTimers,
            [periodWithTimer]: { ...oldTimers[periodWithTimer], [previousTimer]: timeIncrement },
          });
        });
      });

      SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(periodWithoutTimer => {
        const now = Date.now();
        const { nextNow } = soccerClockTestHelpers.incrementTime(now);
        const { store } = soccerClockTestHelpers.setup(
          soccerClockTestHelpers.createSoccerClockState({
            currentPeriod: periodWithoutTimer,
          }),
        );

        expect(() => soccerClockActions.haltGame(nextNow)(store.dispatch, store.getState)).toThrowError();
      });
    });
  });

  // describe('pauseGame', () => {
  //   it('can be fired', () => {
  //     SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(periodWithTimer => {
  //       SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
  //         const now = Date.now();
  //         const { nextNow, timeIncrement } = soccerClockTestHelpers.incrementTime(now);
  //         const { store } = soccerClockTestHelpers.setup(
  //           soccerClockTestHelpers.createSoccerClockState({
  //             currentPeriod: periodWithTimer,
  //             currentTimer: previousTimer,
  //             lastTimeSwitched: nextNow,
  //           }),
  //         );
  //         soccerClockActions.pauseGame(nextNow)(store.dispatch, store.getState);
  //         expect(store.getState().currentPeriod).toBe(periodWithTimer);
  //         expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_TIMER.PAUSED);
  //         expect(store.getState().timers[periodWithTimer][previousTimer]).toBe(timeIncrement);
  //       });
  //     });

  //     SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(periodWithoutTimer => {
  //       const now = Date.now();
  //       const { nextNow } = soccerClockTestHelpers.incrementTime(now);
  //       const { store } = soccerClockTestHelpers.setup(
  //         soccerClockTestHelpers.createSoccerClockState({
  //           currentPeriod: periodWithoutTimer,
  //         }),
  //       );

  //       expect(() => soccerClockActions.pauseGame(nextNow)(store.dispatch, store.getState)).toThrowError();
  //     });
  //   });
  // });

  // describe('resumeGame', () => {
  //   it('can be fired', () => {
  //     SOCCER_CLOCK_PERIODS_WITH_TIMERS.forEach(periodWithTimer => {
  //       SOCCER_CLOCK_ALL_TIMERS.forEach(previousTimer => {
  //         const now = Date.now();
  //         const { nextNow, timeIncrement } = soccerClockTestHelpers.incrementTime(now);
  //         const { store } = soccerClockTestHelpers.setup(
  //           soccerClockTestHelpers.createSoccerClockState({
  //             currentPeriod: periodWithTimer,
  //             currentTimer: previousTimer,
  //             lastTimeSwitched: nextNow,
  //           }),
  //         );
  //         soccerClockActions.resumeGame(nextNow)(store.dispatch, store.getState);
  //         expect(store.getState().currentPeriod).toBe(periodWithTimer);
  //         expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_TIMER.RUNNING);
  //         expect(store.getState().timers[periodWithTimer][previousTimer]).toBe(timeIncrement);
  //       });
  //     });

  //     SOCCER_CLOCK_PERIODS_WITHOUT_TIMERS.forEach(periodWithoutTimer => {
  //       const now = Date.now();
  //       const { nextNow } = soccerClockTestHelpers.incrementTime(now);
  //       const { store } = soccerClockTestHelpers.setup(
  //         soccerClockTestHelpers.createSoccerClockState({
  //           currentPeriod: periodWithoutTimer,
  //         }),
  //       );

  //       expect(() => soccerClockActions.resumeGame(nextNow)(store.dispatch, store.getState)).toThrowError();
  //     });
  //   });
  // });

  // describe('nextPeriod', () => {
  //   it('transitions periods', () => {
  //     SOCCER_CLOCK_ALL_TIMERS.forEach(timer => {
  //       let previousNow = Date.now();
  //       const { store } = soccerClockTestHelpers.setup(
  //         soccerClockTestHelpers.createSoccerClockState({
  //           currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
  //           currentTimer: null,
  //           lastTimeSwitched: null,
  //         }),
  //       );

  //       soccerClockActions.beginGame(previousNow)(store.dispatch, store.getState);

  //       let incrementTimeResponse;
  //       let nextNow;
  //       let timeIncrement;

  //       // first half
  //       let oldTimers = store.getState().timers;
  //       incrementTimeResponse = soccerClockTestHelpers.incrementTime(previousNow);
  //       nextNow = incrementTimeResponse.nextNow;
  //       timeIncrement = incrementTimeResponse.timeIncrement;
  //       soccerClockActions.nextPeriod(nextNow)(store.dispatch, store.getState);
  //       expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.MID_BREAK);
  //       expect(store.getState().currentTimer).toBe(timer);
  //       expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.MID_BREAK);
  //       expect(store.getState().timers).toEqual({
  //         ...oldTimers,
  //         [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
  //           ...oldTimers[SOCCER_CLOCK_PERIOD.FIRST_HALF],
  //           [timer]: oldTimers[SOCCER_CLOCK_PERIOD.FIRST_HALF][timer] + timeIncrement,
  //         },
  //       });
  //       previousNow = nextNow;

  //       // mid break
  //       oldTimers = store.getState().timers;
  //       incrementTimeResponse = soccerClockTestHelpers.incrementTime(previousNow);
  //       nextNow = incrementTimeResponse.nextNow;
  //       timeIncrement = incrementTimeResponse.timeIncrement;
  //       soccerClockActions.nextPeriod(nextNow)(store.dispatch, store.getState);
  //       expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.SECOND_HALF);
  //       expect(store.getState().currentTimer).toBe(timer);
  //       expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.SECOND_HALF);
  //       expect(store.getState().timers).toEqual({
  //         ...oldTimers,
  //         [SOCCER_CLOCK_PERIOD.MID_BREAK]: {
  //           ...oldTimers[SOCCER_CLOCK_PERIOD.MID_BREAK],
  //           [timer]: oldTimers[SOCCER_CLOCK_PERIOD.MID_BREAK][timer] + timeIncrement,
  //         },
  //       });
  //       previousNow = nextNow;

  //       // mid break
  //       oldTimers = store.getState().timers;
  //       incrementTimeResponse = soccerClockTestHelpers.incrementTime(previousNow);
  //       nextNow = incrementTimeResponse.nextNow;
  //       timeIncrement = incrementTimeResponse.timeIncrement;
  //       soccerClockActions.nextPeriod(nextNow)(store.dispatch, store.getState);
  //       expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.GAME_OVER);
  //       expect(store.getState().currentTimer).toBe(timer);
  //       expect(store.getState().currentPeriod).toBe(SOCCER_CLOCK_PERIOD.GAME_OVER);
  //       expect(store.getState().timers).toEqual({
  //         ...oldTimers,
  //         [SOCCER_CLOCK_PERIOD.SECOND_HALF]: {
  //           ...oldTimers[SOCCER_CLOCK_PERIOD.SECOND_HALF],
  //           [timer]: oldTimers[SOCCER_CLOCK_PERIOD.SECOND_HALF][timer] + timeIncrement,
  //         },
  //       });
  //       previousNow = nextNow;
  //     });
  //   });
  // });
});
