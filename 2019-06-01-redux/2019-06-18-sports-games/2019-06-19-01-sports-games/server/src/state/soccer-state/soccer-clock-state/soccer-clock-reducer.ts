import { Reducer } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import {
  SoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_PERIOD_MODE,
  SingleSoccerClockState,
  SOCCER_CLOCK_ACTION_NAMES,
} from './soccer-clock.types';

const defaultInitialSingleClockState: SingleSoccerClockState = {
  currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
  periods: {
    firstHalf: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      lastTimeSwitched: null,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    midBreak: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      lastTimeSwitched: null,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    secondHalf: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      lastTimeSwitched: null,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    notStarted: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      lastTimeSwitched: null,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    penalties: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      lastTimeSwitched: null,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    gameOver: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      lastTimeSwitched: null,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
  },
};

const defaultInitialState: SoccerClockState = {
  current: defaultInitialSingleClockState,
  new: defaultInitialSingleClockState,
};

export const soccerClockReducer: Reducer<SoccerClockState, SoccerGameActionTypes> = (
  currentState: SoccerClockState = { ...defaultInitialState },
  action: SoccerGameActionTypes,
) => {
  switch (action.type) {
    case SOCCER_CLOCK_ACTION_NAMES.NEW_GAME:

    /**
     * game is active -> do nothing
     * game is inactive -> reset state
     */
    case SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME:
      if (!(currentState.current.currentPeriod === SOCCER_CLOCK_PERIOD.NOT_STARTED)) return currentState;

      return {
        ...currentState,
        current: {
          ...currentState.current,
          currentPeriod: SOCCER_CLOCK_PERIOD.FIRST_HALF,
          periods: {
            ...currentState.current.periods,
            [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
              ...currentState.current.periods[SOCCER_CLOCK_PERIOD.FIRST_HALF],
              currentMode: SOCCER_CLOCK_PERIOD.FIRST_HALF,
              lastTimeSwitched: action.payload.now,
            },
          },
        },
      };

    case SOCCER_CLOCK_ACTION_NAMES.HALT_GAME:
      const { currentPeriod } = currentState.current;

      const { currentMode: previousMode, lastTimeSwitched: previousLastTimeSwitched } = currentState.current.periods[
        currentPeriod
      ];

      // TODO: handle error gracefully
      if (previousLastTimeSwitched === null)
        throw new Error('Invalid state: switching from a mode with lastTimeSwitched === null');

      const hua = Object.values(currentPeriod);

      if (!(Object.values(currentPeriod) in currentState.current.periods)) throw new Error('Invalid state');

      const timeToAddToPreviousPeriod = action.payload.now - previousLastTimeSwitched;

      // switch to halted mode
      const next: SoccerClockState = {
        ...currentState,
        current: {
          ...currentState.current,
          periods: {
            ...currentState.current.periods,
            [currentPeriod]: {
              ...currentState.current.periods[currentPeriod],
            },
          },
        },
      };
      // const next = {
      //   ...currentState,
      //   current: {
      //     ...currentState.current,
      //     periods: {
      //       ...currentState.firstHalf
      //       [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
      //         ...currentState.current.periods[SOCCER_CLOCK_PERIOD.FIRST_HALF],
      //       },
      //     },
      //   },
      // };

      return haloha;

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
