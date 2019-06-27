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
  modes: {
    [SOCCER_CLOCK_PERIOD_MODE.HALTED]: number;
    [SOCCER_CLOCK_PERIOD_MODE.PAUSED]: number;
    [SOCCER_CLOCK_PERIOD_MODE.RUNNING]: number;
  };
}

type SoccerClockPeriods = Record<SOCCER_CLOCK_PERIOD, SoccerClockPeriod>;

export interface SingleSoccerClockState {
  currentPeriod: SOCCER_CLOCK_PERIOD;
  lastTimeSwitched: null | number;
  periods: SoccerClockPeriods;
}

export interface SoccerClockState {
  current: SingleSoccerClockState;
  new: SingleSoccerClockState;
}
