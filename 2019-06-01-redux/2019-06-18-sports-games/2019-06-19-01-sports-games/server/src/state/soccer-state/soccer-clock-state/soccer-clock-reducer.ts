import { Reducer } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import {
  SoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SingleSoccerClockState,
  SoccerClockPeriods,
} from './soccer-clock-types';
import { SOCCER_CLOCK_ACTION_NAMES } from './soccer-clock-actions';

const defaultInitialSingleClockState: SingleSoccerClockState = {
  currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
  currentTimer: null, // SOCCER_CLOCK_TIMER.RUNNING,
  lastTimeSwitched: null,
  periods: {
    firstHalf: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    midBreak: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    secondHalf: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    notStarted: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    penalties: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
    },
    gameOver: {
      [SOCCER_CLOCK_TIMER.HALTED]: 0,
      [SOCCER_CLOCK_TIMER.PAUSED]: 0,
      [SOCCER_CLOCK_TIMER.RUNNING]: 0,
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
        currentTimer: SOCCER_CLOCK_TIMER.RUNNING,
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

    case SOCCER_CLOCK_ACTION_NAMES.SWITCH_TIMER: {
      const { now, nextTimer } = action.payload;
      const { currentPeriod, lastTimeSwitched } = oldSoccerClockState;
      const { currentTimer: previousTimer } = oldSoccerClockState;

      // TODO: handle error gracefully
      if (lastTimeSwitched === null)
        throw new Error('Invalid oldSoccerClockState: switching from a mode with lastTimeSwitched === null');
      if (previousTimer === null) throw new Error('Invalid oldSoccerState: previousTimer is null');

      // switch to halted mode
      const newSoccerClockState: SoccerClockState = {
        ...oldSoccerClockState,
        lastTimeSwitched: now,
        currentTimer: nextTimer,
        periods: {
          ...oldSoccerClockState.periods,
          [currentPeriod]: {
            ...oldSoccerClockState.periods[currentPeriod],
            [previousTimer]: oldSoccerClockState.periods[currentPeriod][previousTimer] + now - lastTimeSwitched,
          },
        },
      };

      return newSoccerClockState;
    }

    case SOCCER_CLOCK_ACTION_NAMES.SWITCH_PERIOD: {
      // const { currentPeriod: previousPeriod, lastTimeSwitched } = oldSoccerClockState;
      const { currentPeriod: previousPeriod, currentTimer: previousTimer, lastTimeSwitched } = oldSoccerClockState;

      // TODO: handle error gracefully
      if (lastTimeSwitched === null)
        throw new Error('Invalid oldSoccerClockState: switching from a mode with lastTimeSwitched === null');

      let previousPeriodTimer = null;
      if (previousPeriod in oldSoccerClockState.timers) {
        previousPeriodTimer = {
          [previousPeriod]: {
            ...oldSoccerClockState.timers[previousPeriod],
            [previousTimer]: oldSoccerClockState.timers[previousPeriod][previousTimer] + (now - lastTimeSwitched),
          },
        };
      }

      switch (action.payload.nextPeriod) {
        case SOCCER_CLOCK_PERIOD.MID_BREAK:
        case SOCCER_CLOCK_PERIOD.SECOND_HALF:
        case SOCCER_CLOCK_PERIOD.PENALTIES: {
          const { now, nextPeriod, nextTimer } = action.payload;
          return {
            ...oldSoccerClockState,
            currentPeriod: nextPeriod,
            currentTimer: nextTimer,
            lastTimeSwitched: now,
            ...(oldSoccerClockState.timers[previousPeriod]
              ? {
                  timers: {
                    ...oldSoccerClockState.timers,
                  },
                }
              : {}),
          };
        }
        case SOCCER_CLOCK_PERIOD.GAME_OVER:
          break;
      }

      // TODO: handle error gracefully
      if (lastTimeSwitched === null)
        throw new Error('Invalid oldSoccerClockState: switching from a mode with lastTimeSwitched === null');
      if (previousTimer === null) throw new Error('Invalid oldSoccerState: previousTimer is null');

      const newPeriods: SoccerClockPeriods = {
        ...oldSoccerClockState.periods,
        // increment time of previousPeriod
        [previousPeriod]: {
          ...oldSoccerClockState.periods[previousPeriod],
          [previousTimer]: oldSoccerClockState.periods[previousPeriod][previousTimer] + now - lastTimeSwitched,
        },
        // if previousPeriod === nextPeriod, [previousPeriod] above will be overwritten by [nextPeriod] below
        [nextPeriod]: {
          ...oldSoccerClockState.periods[nextPeriod],
          // ensure time is incremented if period is not changing
          ...(previousPeriod === nextPeriod
            ? { [previousTimer]: oldSoccerClockState.periods[previousPeriod][previousTimer] + now - lastTimeSwitched }
            : {}),
        },
      };

      // switch to halted mode
      const newSoccerClockState: SoccerClockState = {
        ...oldSoccerClockState,
        lastTimeSwitched: now,
        currentTimer: nextTimer,
        periods: newPeriods,
      };
      return newSoccerClockState;
    }

    default:
      return oldSoccerClockState;
  }
};
