import { ThunkAction } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import { SoccerClockState } from './soccer-clock.types';

export enum SOCCER_CLOCK_MODE {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SOCCER_CLOCK_PERIODS {
  NOT_STARTED = 'NOT_STARTED',
  FIRST_HALF = 'FIRST_HALF',
  MID_BREAK = 'MID_BREAK',
  SECOND_HALF = 'SECOND_HALF',
  PENALTIES = 'PENALTIES',
  GAME_OVER = 'GAME_OVER',
}

export enum SOCCER_CLOCK_ACTION_NAMES {
  NEW_GAME = 'NEW_GAME',
  BEGIN_GAME = 'BEGIN_GAME',
  HALT_GAME = 'HALT_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  SET_PERIOD = 'SET_PERIOD',
  END_GAME = 'END_GAME',
}

export type SoccerClockActionTypes =
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.NEW_GAME;
      payload: {};
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME;
      payload: {};
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.HALT_GAME;
      payload: {};
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.PAUSE_GAME;
      payload: {};
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.RESUME_GAME;
      payload: {};
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.SET_PERIOD;
      payload: { newPeriod: SOCCER_CLOCK_PERIODS };
    }
  | {
      type: SOCCER_CLOCK_ACTION_NAMES.END_GAME;
      payload: {};
    };

const newGame = (): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.NEW_GAME, payload: {} });
};

const beginGame = (): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME, payload: {} });
};

const haltGame = (): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.HALT_GAME, payload: {} });
};

const pauseGame = (): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.PAUSE_GAME, payload: {} });
};

const resumeGame = (): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.RESUME_GAME, payload: {} });
};

const setPeriod = (
  newPeriod: SOCCER_CLOCK_PERIODS,
): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.SET_PERIOD, payload: { newPeriod } });
};

const endGame = (): ThunkAction<SoccerClockState, SoccerGameActionTypes> => dispatch => {
  dispatch({ type: SOCCER_CLOCK_ACTION_NAMES.END_GAME, payload: {} });
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
