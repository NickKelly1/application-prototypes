export enum SOCCER_CLOCK_ACTION_NAMES {
  NEW_GAME = 'NEW_GAME',
  BEGIN_GAME = 'BEGIN_GAME',
  HALT_GAME = 'HALT_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  SET_PERIOD = 'SET_PERIOD',
  END_GAME = 'END_GAME',
}

const z: SOCCER_CLOCK_ACTION_NAMES = SOCCER_CLOCK_ACTION_NAMES.NEW_GAME;

// export enum SOCCER_CLOCK_STATUSES {
//   ACTIVE = 'ACTIVE',
//   HALTED = 'HALTED',
//   INACTIVE = 'INACTIVE',
// }

export enum SOCCER_CLOCK_PERIOD {
  NOT_STARTED = 'notStarted',
  FIRST_HALF = 'firstHalf',
  MID_BREAK = 'midBreak',
  SECOND_HALF = 'secondHalf',
  PENALTIES = 'penalties',
  GAME_OVER = 'gameOver',
}

export enum SOCCER_CLOCK_PERIOD_MODE {
  HALTED = 'halted',
  PAUSED = 'paused',
  RUNNING = 'running',
}

interface SoccerClockPeriod {
  currentMode: SOCCER_CLOCK_PERIOD_MODE;
  lastTimeSwitched: null | number;
  modes: {
    [SOCCER_CLOCK_PERIOD_MODE.HALTED]: number;
    [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: number;
    [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: number;
  };
}

type SoccerClockPeriods = Record<SOCCER_CLOCK_PERIOD, SoccerClockPeriod>;

interface SoccerClockPeriods2 {
  [SOCCER_CLOCK_PERIOD.NOT_STARTED]: SoccerClockPeriod;
  [SOCCER_CLOCK_PERIOD.FIRST_HALF]: SoccerClockPeriod;
  [SOCCER_CLOCK_PERIOD.MID_BREAK]: SoccerClockPeriod;
  [SOCCER_CLOCK_PERIOD.SECOND_HALF]: SoccerClockPeriod;
  [SOCCER_CLOCK_PERIOD.PENALTIES]: SoccerClockPeriod;
  [SOCCER_CLOCK_PERIOD.GAME_OVER]: SoccerClockPeriod;
}

export interface SingleSoccerClockState {
  currentPeriod: SOCCER_CLOCK_PERIOD;
  periods: SoccerClockPeriods;
}

export interface SoccerClockState {
  current: SingleSoccerClockState;
  new: SingleSoccerClockState;
}
