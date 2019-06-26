import { ThunkAction } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import { SoccerClockState, SOCCER_CLOCK_ACTION_NAMES, SOCCER_CLOCK_PERIOD } from './soccer-clock.types';

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
      type: SOCCER_CLOCK_ACTION_NAMES.HALT_GAME;
      payload: { now: number };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.PAUSE_GAME;
      payload: { now: number };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.RESUME_GAME;
      payload: { now: number };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.SET_PERIOD;
      payload: { now: number; newPeriod: SOCCER_CLOCK_PERIOD };
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
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.HALT_GAME, payload: { now } });
};

const pauseGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.PAUSE_GAME, payload: { now } });
};

const resumeGame = (now = Date.now()): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.RESUME_GAME, payload: { now } });
};

const setPeriod = (
  newPeriod: SOCCER_CLOCK_PERIOD,
  now = Date.now(),
): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.SET_PERIOD, payload: { now, newPeriod } });
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
  setPeriod,
  endGame,
};
