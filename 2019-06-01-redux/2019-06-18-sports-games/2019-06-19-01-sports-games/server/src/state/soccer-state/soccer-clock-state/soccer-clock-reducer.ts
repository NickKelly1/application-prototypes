import { Reducer } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import {
  SoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_PERIOD_MODE,
  SingleSoccerClockState,
  SoccerClockPeriods,
} from './soccer-clock-types';
import { SOCCER_CLOCK_ACTION_NAMES } from './soccer-clock-actions';

const defaultInitialSingleClockState: SingleSoccerClockState = {
  currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
  currentMode: null, // SOCCER_CLOCK_PERIOD_MODE.RUNNING,
  lastTimeSwitched: null,
  periods: {
    firstHalf: {
      [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
    },
    midBreak: {
      [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
    },
    secondHalf: {
      [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
    },
    notStarted: {
      [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
    },
    penalties: {
      [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
    },
    gameOver: {
      [SOCCER_CLOCK_PERIOD_MODE.HALTED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: 0,
      [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: 0,
    },
  },
};

const defaultInitialState: SoccerClockState = defaultInitialSingleClockState;

export const soccerClockReducer: Reducer<SoccerClockState, SoccerGameActionTypes> = (
  oldSoccerClockState: SoccerClockState = { ...defaultInitialState },
  action: SoccerGameActionTypes,
) => {
  switch (action.type) {
    case SOCCER_CLOCK_ACTION_NAMES.NEW_GAME:
      return action.payload.newGameSoccerClockState;

    case SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME: {
      // can't begin unless in "NOT_STARTED"
      if (oldSoccerClockState.currentPeriod !== SOCCER_CLOCK_PERIOD.NOT_STARTED)
        throw new Error(`Invalid action: cannot begin game in period: ${oldSoccerClockState.currentPeriod}`);

      const { now } = action.payload;

      const newSoccerClockState: SoccerClockState = {
        ...oldSoccerClockState,
        currentPeriod: SOCCER_CLOCK_PERIOD.FIRST_HALF,
        currentMode: SOCCER_CLOCK_PERIOD_MODE.RUNNING,
        lastTimeSwitched: now,
        periods: {
          ...oldSoccerClockState.periods,
          [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
            ...oldSoccerClockState.periods[SOCCER_CLOCK_PERIOD.FIRST_HALF],
          },
        },
      };

      return newSoccerClockState;
    }

    case SOCCER_CLOCK_ACTION_NAMES.SWITCH_MODE: {
      const { now, nextMode } = action.payload;
      const { currentPeriod, lastTimeSwitched } = oldSoccerClockState;
      const { currentMode: previousMode } = oldSoccerClockState;

      // TODO: handle error gracefully
      if (lastTimeSwitched === null)
        throw new Error('Invalid oldSoccerClockState: switching from a mode with lastTimeSwitched === null');
      if (previousMode === null) throw new Error('Invalid oldSoccerState: previousMode is null');

      // switch to halted mode
      const newSoccerClockState: SoccerClockState = {
        ...oldSoccerClockState,
        lastTimeSwitched: now,
        currentMode: nextMode,
        periods: {
          ...oldSoccerClockState.periods,
          [currentPeriod]: {
            ...oldSoccerClockState.periods[currentPeriod],
            [previousMode]: oldSoccerClockState.periods[currentPeriod][previousMode] + now - lastTimeSwitched,
          },
        },
      };

      return newSoccerClockState;
    }

    case SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD_AND_MODE: {
      const { now, nextMode, nextPeriod } = action.payload;
      const { currentPeriod: previousPeriod, lastTimeSwitched } = oldSoccerClockState;
      const { currentMode: previousMode } = oldSoccerClockState;

      // TODO: handle error gracefully
      if (lastTimeSwitched === null)
        throw new Error('Invalid oldSoccerClockState: switching from a mode with lastTimeSwitched === null');
      if (previousMode === null) throw new Error('Invalid oldSoccerState: previousMode is null');

      const newPeriods: SoccerClockPeriods = {
        ...oldSoccerClockState.periods,
        // increment time of previousPeriod
        [previousPeriod]: {
          ...oldSoccerClockState.periods[previousPeriod],
          [previousMode]: oldSoccerClockState.periods[previousPeriod][previousMode] + now - lastTimeSwitched,
        },
        // if previousPeriod === nextPeriod, [previousPeriod] above will be overwritten by [nextPeriod] below
        [nextPeriod]: {
          ...oldSoccerClockState.periods[nextPeriod],
          // ensure time is incremented if period is not changing
          ...(previousPeriod === nextPeriod
            ? { [previousMode]: oldSoccerClockState.periods[previousPeriod][previousMode] + now - lastTimeSwitched }
            : {}),
        },
      };

      // switch to halted mode
      const newSoccerClockState: SoccerClockState = {
        ...oldSoccerClockState,
        lastTimeSwitched: now,
        currentMode: nextMode,
        periods: newPeriods,
      };
      return newSoccerClockState;
    }

    default:
      return oldSoccerClockState;
  }
};
