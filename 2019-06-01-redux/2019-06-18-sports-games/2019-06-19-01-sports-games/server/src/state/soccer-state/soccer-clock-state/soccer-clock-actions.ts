import { ThunkAction } from '../../../lib/store/store.types';
import { SoccerClockState, SOCCER_CLOCK_PERIOD, SOCCER_CLOCK_TIMER } from './soccer-clock-state';
import { ValueFrom } from '../../../../@types/helpers';
import { SoccerEventPayloads, SOCCER_EVENTS } from '../soccer-game-events';

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
  ): ThunkAction<SoccerClockState, SoccerEventPayloads> => dispatch => {
    dispatch({ type: SOCCER_EVENTS.NEW_GAME, payload: { now, newGameSoccerClockState } });
  },

  /**
   * @description
   * Begin the new game
   *
   * @param now
   */
  beginGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerEventPayloads> => dispatch => {
    dispatch({ type: SOCCER_EVENTS.BEGIN_GAME, payload: { now } });
  },

  /**
   * @description
   * Halt the game
   *
   * @param now
   */
  haltGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerEventPayloads> => dispatch => {
    dispatch({
      type: SOCCER_EVENTS.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.HALTED },
    });
  },

  /**
   * @description
   * Pause the game
   *
   * @param now
   */
  pauseGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerEventPayloads> => dispatch => {
    dispatch({
      type: SOCCER_EVENTS.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.PAUSED },
    });
  },

  /**
   * @description
   * Resume the game
   *
   * @param now
   */
  resumeGame: (now = Date.now()): ThunkAction<SoccerClockState, SoccerEventPayloads> => dispatch => {
    dispatch({
      type: SOCCER_EVENTS.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.RUNNING },
    });
  },

  /**
   * @description
   * Go to the next period
   *
   * @param now
   */
  nextPeriod: (now = Date.now()): ThunkAction<SoccerClockState, SoccerEventPayloads> => (dispatch, getState) => {
    const { currentPeriod: previousPeriod, currentTimer } = getState();

    switch (previousPeriod) {
      // first half -> mid break
      case SOCCER_CLOCK_PERIOD.FIRST_HALF: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.MID_BREAK;
        const nextTimer = currentTimer !== null ? currentTimer : SOCCER_CLOCK_TIMER.HALTED;
        dispatch({
          type: SOCCER_EVENTS.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod, nextTimer },
        });
        break;
      }
      // mid break -> second half
      case SOCCER_CLOCK_PERIOD.MID_BREAK: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.SECOND_HALF;
        const nextTimer = currentTimer !== null ? currentTimer : SOCCER_CLOCK_TIMER.HALTED;
        dispatch({
          type: SOCCER_EVENTS.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod, nextTimer },
        });
        break;
      }
      // second half -> game over
      // TODO: handle penalties
      case SOCCER_CLOCK_PERIOD.SECOND_HALF: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
        dispatch({
          type: SOCCER_EVENTS.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod },
        });
        break;
      }
      // penalties -> game over
      case SOCCER_CLOCK_PERIOD.PENALTIES: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
        dispatch({
          type: SOCCER_EVENTS.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod },
        });
        break;
      }
      default:
        throw new TypeError(`Cannot call nextPeriod when current period is: "${previousPeriod}"`);
    }
  },
};
