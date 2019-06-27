import { ThunkAction } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import { SoccerClockState, SOCCER_CLOCK_PERIOD, SOCCER_CLOCK_PERIOD_MODE } from './soccer-clock.types';

export enum SOCCER_CLOCK_ACTION_NAMES {
  NEW_GAME = 'NEW_GAME',
  BEGIN_GAME = 'BEGIN_GAME',
  SWITCH_MODE = 'SWITCH_MODE',
  SWITCH_PERIOD_AND_MODE = 'SWITCH_PERIOD_AND_MODE',
  END_GAME = 'END_GAME',
}

export type SoccerClockActionTypes =
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.NEW_GAME;
      payload: { now: number };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME;
      payload: { now: number };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_MODE;
      payload: { now: number; nextMode: SOCCER_CLOCK_PERIOD_MODE };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD_AND_MODE;
      payload: { now: number; newPeriod: SOCCER_CLOCK_PERIOD; newMode: SOCCER_CLOCK_PERIOD_MODE };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.END_GAME;
      payload: { now: number };
    };

const newGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.NEW_GAME, payload: { now } });
};

const beginGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: { now } });
};

const haltGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_MODE,
    payload: { now, nextMode: SOCCER_CLOCK_PERIOD_MODE.HALTED },
  });
};

const pauseGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_MODE,
    payload: { now, nextMode: SOCCER_CLOCK_PERIOD_MODE.PAUSED },
  });
};

const resumeGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_MODE,
    payload: { now, nextMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING },
  });
};

const switchPeriodAndMode = (
  newPeriod: SOCCER_CLOCK_PERIOD,
  newMode: SOCCER_CLOCK_PERIOD_MODE,
  now = Date.now(),
): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD_AND_MODE, payload: { now, newPeriod, newMode } });
};

const endGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.END_GAME, payload: { now } });
};

export const soccerClockActions = {
  newGame,
  beginGame,
  haltGame,
  pauseGame,
  resumeGame,
  switchPeriodAndMode,
  endGame,
};
