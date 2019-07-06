import { ThunkAction } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { SoccerClockState, SOCCER_CLOCK_PERIOD, SOCCER_CLOCK_TIMER } from './soccer-clock-state';
import { ValueFrom } from '../../../../@types/helpers';

export enum SOCCER_CLOCK_ACTION_NAMES {
  NEW_GAME = 'NEW_GAME',
  BEGIN_GAME = 'BEGIN_GAME',
  SWITCH_CLOCK_TIMER = 'SWITCH_CLOCK_TIMER',
  SWITCH_CLOCK_PERIOD = 'SWITCH_CLOCK_PERIOD',
}

export type SoccerClockActionTypes =
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.NEW_GAME;
      payload: { now: number; newGameSoccerClockState: SoccerClockState };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME;
      payload: { now: number };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_TIMER;
      payload: { now: number; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_PERIOD;
      payload:  // @note: must include all periods - with timers & without // periods with timers
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['FIRST_HALF']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['MID_BREAK']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['SECOND_HALF']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['PENALTIES']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        // periods without timers
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['NOT_STARTED'] }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['GAME_OVER'] };
    };

export const soccerClockActions = {
  /**
   * @description
   * Set up a new game
   *
   * @param newGameSoccerClockState
   * @param now
   */
  newGame: (
    newGameSoccerClockState: SoccerClockState,
    now = Date.now(),
  ): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
    dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.NEW_GAME, payload: { now, newGameSoccerClockState } });
  },

  /**
   * @description
   * Begin the new game
   *
   * @param now
   */
  beginGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
    dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } });
  },

  /**
   * @description
   * Halt the game
   *
   * @param now
   */
  haltGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
    dispatch({
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.HALTED },
    });
  },

  /**
   * @description
   * Pause the game
   *
   * @param now
   */
  pauseGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
    dispatch({
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.PAUSED },
    });
  },

  /**
   * @description
   * Resume the game
   *
   * @param now
   */
  resumeGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
    dispatch({
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.RUNNING },
    });
  },

  /**
   * @description
   * Go to the next period
   *
   * @param now
   */
  nextPeriod: (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => (dispatch, getState) => {
    const { currentPeriod: previousPeriod, currentTimer } = getState();

    switch (previousPeriod) {
      // first half -> mid break
      case SOCCER_CLOCK_PERIOD.FIRST_HALF: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.MID_BREAK;
        const nextTimer = currentTimer !== null ? currentTimer : SOCCER_CLOCK_TIMER.HALTED;
        dispatch({
          type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod, nextTimer },
        });
        break;
      }
      // mid break -> second half
      case SOCCER_CLOCK_PERIOD.MID_BREAK: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.SECOND_HALF;
        const nextTimer = currentTimer !== null ? currentTimer : SOCCER_CLOCK_TIMER.HALTED;
        dispatch({
          type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod, nextTimer },
        });
        break;
      }
      // second half -> game over
      // TODO: handle penalties
      case SOCCER_CLOCK_PERIOD.SECOND_HALF: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
        dispatch({
          type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod },
        });
        break;
      }
      // penalties -> game over
      case SOCCER_CLOCK_PERIOD.PENALTIES: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
        dispatch({
          type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod },
        });
        break;
      }
      default:
        throw new TypeError(`Cannot call nextPeriod when current period is: "${previousPeriod}"`);
    }
  },
};
