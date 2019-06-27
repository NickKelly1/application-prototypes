import { Reducer } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import {
  SoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_PERIOD_MODE,
  SingleSoccerClockState,
} from './soccer-clock.types';
import { SOCCER_CLOCK_ACTION_NAMES } from './soccer-clock-actions';

const defaultInitialSingleClockState: SingleSoccerClockState = {
  currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
  lastTimeSwitched: null,
  periods: {
    firstHalf: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    midBreak: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    secondHalf: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    notStarted: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    penalties: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
      modes: {
        [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
        [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
      },
    },
    gameOver: {
      currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
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
  oldState: SoccerClockState = { ...defaultInitialState },
  action: SoccerGameActionTypes,
) => {
  switch (action.type) {
    case SOCCER_CLOCK_ACTION_NAMES.NEW_GAME:

    case SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME: {
      if (!(oldState.current.currentPeriod === SOCCER_CLOCK_PERIOD.NOT_STARTED)) return oldState;
      const { now } = action.payload;

      const newState: SoccerClockState = {
        ...oldState,
        current: {
          ...oldState.current,
          currentPeriod: SOCCER_CLOCK_PERIOD.FIRST_HALF,
          lastTimeSwitched: now,
          periods: {
            ...oldState.current.periods,
            [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
              ...oldState.current.periods[SOCCER_CLOCK_PERIOD.FIRST_HALF],
              currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
            },
          },
        },
      };

      return newState;
    }

    case SOCCER_CLOCK_ACTION_NAMES.SWITCH_MODE: {
      const { now, nextMode } = action.payload;
      const { currentPeriod, lastTimeSwitched } = oldState.current;
      const { currentMode: oldMode } = oldState.current.periods[currentPeriod];

      // TODO: handle error gracefully
      if (lastTimeSwitched === null)
        throw new Error('Invalid oldState: switching from a mode with lastTimeSwitched === null');

      // switch to halted mode
      const newState: SoccerClockState = {
        ...oldState,
        current: {
          ...oldState.current,
          lastTimeSwitched: now,
          periods: {
            ...oldState.current.periods,
            [currentPeriod]: {
              ...oldState.current.periods[currentPeriod],
              currentMode: nextMode,
              [oldMode]: oldState.current.periods[currentPeriod].modes[oldMode] + now - lastTimeSwitched,
            },
          },
        },
      };

      return newState;
    }

    default:
      return oldState;
  }
};
