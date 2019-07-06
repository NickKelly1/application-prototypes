import { Reducer } from '../../../lib/store/store.types';
import { SoccerGameActionTypes } from '../soccer-game-state';
import {
  SoccerClockState,
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SingleSoccerClockState,
  SOCCER_CLOCK_PERIODS_WITH_TIMERS,
  SOCCER_CLOCK_CAN_BEGIN_PERIODS,
} from './soccer-clock-state';
import { SOCCER_CLOCK_ACTION_NAMES } from './soccer-clock-actions';
import { tupleIncludes } from '../../../helpers/tuple-includes';
import { InvalidStateChangeException } from '../../../exceptions/invalid-state-change-exception';

const defaultInitialSingleClockState: SingleSoccerClockState = {
  currentPeriod: SOCCER_CLOCK_PERIOD.NOT_STARTED,
  currentTimer: null,
  lastTimeSwitched: null,
  timers: {
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
    penalties: {
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
    /**
     * @description
     * set up a new game
     */
    case SOCCER_CLOCK_ACTION_NAMES.NEW_GAME:
      return action.payload.newGameSoccerClockState;

    /**
     * @description
     * Begin a new game
     */
    case SOCCER_CLOCK_ACTION_NAMES.BEGIN_GAME: {
      // can't begin unless in "NOT_STARTED"
      if (!tupleIncludes(SOCCER_CLOCK_CAN_BEGIN_PERIODS, oldSoccerClockState.currentPeriod))
        throw new InvalidStateChangeException(oldSoccerClockState, action);

      const { now } = action.payload;

      const newSoccerClockState: SoccerClockState = {
        ...oldSoccerClockState,
        currentPeriod: SOCCER_CLOCK_PERIOD.FIRST_HALF,
        currentTimer: SOCCER_CLOCK_TIMER.RUNNING,
        lastTimeSwitched: now,
        timers: {
          ...oldSoccerClockState.timers,
          [SOCCER_CLOCK_PERIOD.FIRST_HALF]: {
            ...oldSoccerClockState.timers[SOCCER_CLOCK_PERIOD.FIRST_HALF],
          },
        },
      };

      return newSoccerClockState;
    }

    /**
     * @description
     * Switch timer within a period
     */
    case SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_TIMER: {
      const { now, nextTimer } = action.payload;
      const { currentPeriod, lastTimeSwitched } = oldSoccerClockState;
      const { currentTimer: previousTimer } = oldSoccerClockState;

      // cannot switch timer if current period doesn't have timers
      if (!tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, currentPeriod))
        throw new InvalidStateChangeException(oldSoccerClockState, action);

      // should have a previous timer and last time switched
      if (lastTimeSwitched === null) throw new InvalidStateChangeException(oldSoccerClockState, action);
      if (previousTimer === null) throw new InvalidStateChangeException(oldSoccerClockState, action);

      const newSoccerClockState: SoccerClockState = {
        ...oldSoccerClockState,
        lastTimeSwitched: now,
        currentTimer: nextTimer,
        timers: {
          ...oldSoccerClockState.timers,
          [currentPeriod]: {
            ...oldSoccerClockState.timers[currentPeriod],
            [previousTimer]: oldSoccerClockState.timers[currentPeriod][previousTimer] + now - lastTimeSwitched,
          },
        },
      };

      return newSoccerClockState;
    }

    /**
     * @description
     * Switch period and timer
     */
    case SOCCER_CLOCK_ACTION_NAMES.SWITCH_CLOCK_PERIOD: {
      const { currentPeriod: previousPeriod, currentTimer: previousTimer, lastTimeSwitched } = oldSoccerClockState;
      const { now, nextPeriod } = action.payload;

      let previousPeriodTimer = {};
      if (tupleIncludes(SOCCER_CLOCK_PERIODS_WITH_TIMERS, previousPeriod)) {
        if (previousTimer === null) throw new InvalidStateChangeException(oldSoccerClockState, action);
        if (lastTimeSwitched === null) throw new InvalidStateChangeException(oldSoccerClockState, action);

        previousPeriodTimer = {
          [previousPeriod]: {
            ...oldSoccerClockState.timers[previousPeriod],
            [previousTimer]: oldSoccerClockState.timers[previousPeriod][previousTimer] + (now - lastTimeSwitched),
          },
        };
      }

      switch (action.payload.nextPeriod) {
        // periods with timers
        case SOCCER_CLOCK_PERIOD.FIRST_HALF:
        case SOCCER_CLOCK_PERIOD.MID_BREAK:
        case SOCCER_CLOCK_PERIOD.SECOND_HALF:
        case SOCCER_CLOCK_PERIOD.PENALTIES: {
          const { nextTimer } = action.payload;
          return {
            ...oldSoccerClockState,
            ...previousPeriodTimer,
            currentPeriod: nextPeriod,
            currentTimer: nextTimer,
            lastTimeSwitched: now,
            timers: {
              ...oldSoccerClockState.timers,
              ...previousPeriodTimer,
            },
          };
        }

        // periods without timers
        case SOCCER_CLOCK_PERIOD.NOT_STARTED:
        case SOCCER_CLOCK_PERIOD.GAME_OVER:
          return {
            ...oldSoccerClockState,
            ...previousPeriodTimer,
            currentPeriod: nextPeriod,
            currentTimer: null,
            lastTimeSwitched: now,
            timers: {
              ...oldSoccerClockState.timers,
              ...previousPeriodTimer,
            },
          };
        default:
          throw new InvalidStateChangeException(oldSoccerClockState, action);
      }
    }
    default:
      throw new InvalidStateChangeException(oldSoccerClockState, action);
  }
};
