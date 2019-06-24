import { Reducer } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import { SOCCER_CLOCK_ACTION_NAMES, SOCCER_CLOCK_MODE } from './soccer-clock-actions';
import { SoccerClockState } from './soccer-clock.types';

export const soccerClockReducer: Reducer<SoccerClockState, SoccerGameActionTypes> = (
  state: SoccerClockState,
  action: SoccerGameActionTypes,
) => {
  switch (action.type) {
    case SOCCER_CLOCK_ACTION_NAMES.NEW_GAME:

    /**
     * game is active -> do nothing
     * game is inactive -> reset state
     */
    case SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME:
      if (state.current.mode === SOCCER_CLOCK_MODE.ACTIVE) return state;
      return {
        ...state,
        current: {
          lastTimeSwitched: action.payload.now,
        },
      };
    // reinitialize game
    // if game is active -> do nothing

    case SOCCER_CLOCK_ACTION_NAMES.HALT_GAME:
    // if game is halted -> do nothing

    case SOCCER_CLOCK_ACTION_NAMES.PAUSE_GAME:
    // if game is not active -> do nothing
    // if game is paused -> do nothing
    // if game is active -> pause

    case SOCCER_CLOCK_ACTION_NAMES.RESUME_GAME:
    // if game is active and running -> do nothing

    case SOCCER_CLOCK_ACTION_NAMES.SET_PERIOD:
    //

    default:
      return state;
  }
};
