import {
  SingleSoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_PERIOD_MODE,
  SoccerClockState,
} from './soccer-clock-types';
import { createStore } from '../../../lib/store/store';
import { soccerClockReducer } from './soccer-clock-reducer';
import { soccerClockActions, SOCCER_CLOCK_ACTION_NAMES } from './soccer-clock-actions';
import { SoccerGameActionTypes } from '../soccer-game.types';

const setup = ({ period, mode }: { period?: SOCCER_CLOCK_PERIOD; mode?: null | SOCCER_CLOCK_PERIOD_MODE }) => {
  const initialState: SingleSoccerClockState = {
    currentPeriod: period !== undefined ? period : SOCCER_CLOCK_PERIOD.NOT_STARTED,
    currentMode: mode !== undefined ? mode : null,
    lastTimeSwitched: null,
    periods: {
      firstHalf: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
      midBreak: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
      secondHalf: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
      notStarted: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
      penalties: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
      gameOver: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
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
    const validPeriods = [SOCCER_CLOCK_PERIOD.NOT_STARTED];
    const invalidPeriods = Object.values(SOCCER_CLOCK_PERIOD).filter(period => !validPeriods.includes(period));

    validPeriods.forEach(validPeriod => {
      const { store } = setup({ period: validPeriod });
      store.dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } });
      expect(store.getState().currentPeriod).toEqual(SOCCER_CLOCK_PERIOD.FIRST_HALF);
      expect(store.getState().currentMode).toEqual(SOCCER_CLOCK_PERIOD_MODE.RUNNING);
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
  it('should switch modes when possible', () => {
    const now = Date.now();
    const allPeriods = Object.values(SOCCER_CLOCK_PERIOD);
    const invalidPeriods = [SOCCER_CLOCK_PERIOD.GAME_OVER, SOCCER_CLOCK_PERIOD.NOT_STARTED];
    const validPeriods = Object.values(SOCCER_CLOCK_PERIOD).filter(period => !invalidPeriods.includes(period));

    validPeriods.forEach(validPeriod => {
      allPeriods.forEach((nextPeriod) => {
        const { store } = setup({ period: validPeriod });
        store.dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_MODE, payload: { now, nextMode: }});

      })
      expect();
    });
    soccerClockActions.beginGame(now)(store.dispatch, store.getState);
    expect().toThrowError();
  });
});
