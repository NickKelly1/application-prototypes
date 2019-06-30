import { ThunkAction } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { SoccerClockState, SOCCER_CLOCK_PERIOD, SOCCER_CLOCK_TIMER } from './soccer-clock-state';
import { ValueFrom } from '../../../../@types/helpers';

export enum SOCCER_CLOCK_ACTION_NAMES {
  NEW_GAME = 'NEW_GAME',
  BEGIN_GAME = 'BEGIN_GAME',
  SWITCH_TIMER = 'SWITCH_TIMER',
  SWITCH_PERIOD = 'SWITCH_PERIOD',
  END_GAME = 'END_GAME',
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
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER;
      payload: { now: number; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD;
      payload:
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['FIRST_HALF']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['MID_BREAK']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['SECOND_HALF']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['PENALTIES']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['GAME_OVER'] };
    };

/**
 * @description
 * Set up a new game
 *
 * @param newGameSoccerClockState
 * @param now
 */
const newGame = (
  newGameSoccerClockState: SoccerClockState,
  now = Date.now(),
): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.NEW_GAME, payload: { now, newGameSoccerClockState } });
};

/**
 * @description
 * Begin the new game
 *
 * @param now
 */
const beginGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } });
};

/**
 * @description
 * Halt the game
 *
 * @param now
 */
const haltGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER,
    payload: { now, nextTimer: SOCCER_CLOCK_TIMER.HALTED },
  });
};

/**
 * @description
 * Pause the game
 *
 * @param now
 */
const pauseGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER,
    payload: { now, nextTimer: SOCCER_CLOCK_TIMER.PAUSED },
  });
};

/**
 * @description
 * Resume the game
 *
 * @param now
 */
const resumeGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER,
    payload: { now, nextTimer: SOCCER_CLOCK_TIMER.RUNNING },
  });
};

/**
 * @description
 * Go to the next period
 *
 * @param now
 */
const nextPeriod = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => (dispatch, getState) => {
  const { currentPeriod } = getState();

  switch (currentPeriod) {
    // first half -> mid break
    case SOCCER_CLOCK_PERIOD.FIRST_HALF: {
      const nextPeriod = SOCCER_CLOCK_PERIOD.MID_BREAK;
      const nextTimer = SOCCER_CLOCK_TIMER.RUNNING;
      dispatch({
        type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
        payload: { now, nextPeriod, nextTimer },
      });
      break;
    }
    // mid break -> second half
    case SOCCER_CLOCK_PERIOD.MID_BREAK: {
      const nextPeriod = SOCCER_CLOCK_PERIOD.SECOND_HALF;
      const nextTimer = SOCCER_CLOCK_TIMER.RUNNING;
      dispatch({
        type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
        payload: { now, nextPeriod, nextTimer },
      });
      break;
    }
    // second half -> game over
    // TODO: handle penalties
    case SOCCER_CLOCK_PERIOD.SECOND_HALF: {
      const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
      dispatch({
        type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
        payload: { now, nextPeriod },
      });
      break;
    }
    // penalties -> game over
    case SOCCER_CLOCK_PERIOD.PENALTIES: {
      const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
      dispatch({
        type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD,
        payload: { now, nextPeriod },
      });
      break;
    }
    default:
      throw new TypeError(`Cannot call nextPeriod when current period is: "${currentPeriod}"`);
  }
};

export const soccerClockActions = {
  newGame,
  beginGame,
  haltGame,
  pauseGame,
  resumeGame,
  nextPeriod,
};
