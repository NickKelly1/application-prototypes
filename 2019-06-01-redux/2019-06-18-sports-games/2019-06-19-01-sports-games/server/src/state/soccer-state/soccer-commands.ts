import { Store } from '../../lib/store/store.types';
import { SoccerState } from './soccer-state';
import { SoccerEventPayloads, SOCCER_EVENT } from './soccer-events';
import { SoccerClockState, SOCCER_CLOCK_TIMER, SOCCER_CLOCK_PERIOD } from './soccer-clock-state/soccer-clock-state';

export const SOCCER_COMMANDS = {
  NEW_GAME: 'newGame',
  BEGIN_GAME: 'beginGame',
  HALT_GAME: 'haltGame',
  PAUSE_GAME: 'pauseGame',
  RESUME_GAME: 'resumeGame',
  NEXT_PERIOD: 'nextPeriod',
} as const;

export type SOCCER_COMMANDS = typeof SOCCER_COMMANDS;

export class SoccerCommands {
  /**
   * @description
   * Store to dispatch upon
   */
  private store: Store<SoccerState, SoccerEventPayloads>;

  /**
   * @constructor
   *
   * @param store
   */
  public constructor(store: Store<SoccerState, SoccerEventPayloads>) {
    this.store = store;
  }

  /**
   * @description
   * Dispatch function from the store
   */
  private get dispatch() {
    return this.store.dispatch;
  }

  /**
   * @description
   * Get state function from the store
   */
  private get getState() {
    return this.store.getState;
  }

  /**
   * @description
   * Try to set a new game
   *
   * @param newSoccerClockState
   * @param now
   */
  public [SOCCER_COMMANDS.NEW_GAME] = (newSoccerClockState: SoccerClockState, now: number = Date.now()) => {
    if (now === undefined) now = Date.now();
    this.dispatch({ type: SOCCER_EVENT.NEW_GAME, payload: { now, newGameSoccerClockState: newSoccerClockState } });
  };

  /**
   * @description
   * Try to begin a game
   *
   * @param now
   */
  public [SOCCER_COMMANDS.BEGIN_GAME] = (now = Date.now()) => {
    this.dispatch({ type: SOCCER_EVENT.BEGIN_GAME, payload: { now } });
  };

  /**
   * @description
   * Try to halt the game
   *
   * @param now
   */
  public [SOCCER_COMMANDS.HALT_GAME] = (now = Date.now()) => {
    this.dispatch({
      type: SOCCER_EVENT.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.HALTED },
    });
  };

  /**
   * @description
   * Try to pause the game
   *
   * @param now
   */
  public [SOCCER_COMMANDS.PAUSE_GAME] = (now = Date.now()) => {
    this.dispatch({
      type: SOCCER_EVENT.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.PAUSED },
    });
  };

  /**
   * @description
   * Try to resume game
   */
  public [SOCCER_COMMANDS.RESUME_GAME] = (now = Date.now()) => {
    this.dispatch({
      type: SOCCER_EVENT.SWITCH_CLOCK_TIMER,
      payload: { now, nextTimer: SOCCER_CLOCK_TIMER.RUNNING },
    });
  };

  /**
   * @description
   * Try to go to the next period of the clock
   *
   * @param now
   */
  public [SOCCER_COMMANDS.NEXT_PERIOD] = (now = Date.now()) => {
    const { currentPeriod: previousPeriod, currentTimer } = this.getState().clock;

    switch (previousPeriod) {
      // first half -> mid break
      case SOCCER_CLOCK_PERIOD.FIRST_HALF: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.MID_BREAK;
        const nextTimer = currentTimer !== null ? currentTimer : SOCCER_CLOCK_TIMER.HALTED;
        this.dispatch({
          type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod, nextTimer },
        });
        break;
      }
      // mid break -> second half
      case SOCCER_CLOCK_PERIOD.MID_BREAK: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.SECOND_HALF;
        const nextTimer = currentTimer !== null ? currentTimer : SOCCER_CLOCK_TIMER.HALTED;
        this.dispatch({
          type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod, nextTimer },
        });
        break;
      }
      // second half -> game over
      // TODO: handle penalties
      case SOCCER_CLOCK_PERIOD.SECOND_HALF: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
        this.dispatch({
          type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod },
        });
        break;
      }
      // penalties -> game over
      case SOCCER_CLOCK_PERIOD.PENALTIES: {
        const nextPeriod = SOCCER_CLOCK_PERIOD.GAME_OVER;
        this.dispatch({
          type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD,
          payload: { now, nextPeriod },
        });
        break;
      }
      default:
        throw new TypeError(`Cannot call nextPeriod when current period is: "${previousPeriod}"`);
    }
  };
}
