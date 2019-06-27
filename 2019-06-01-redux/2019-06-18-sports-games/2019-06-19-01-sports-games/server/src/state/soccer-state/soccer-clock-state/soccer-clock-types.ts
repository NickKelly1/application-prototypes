export enum SOCCER_CLOCK_PERIOD {
  NOT_STARTED = 'notStarted',
  FIRST_HALF = 'firstHalf',
  MID_BREAK = 'midBreak',
  SECOND_HALF = 'secondHalf',
  PENALTIES = 'penalties',
  GAME_OVER = 'gameOver',
}

export enum SOCCER_CLOCK_TIMER {
  HALTED = 'halted',
  PAUSED = 'paused',
  RUNNING = 'running',
}

interface SoccerClockPeriodTimer {
  [SOCCER_CLOCK_TIMER.HALTED]: number;
  [SOCCER_CLOCK_TIMER.PAUSED]: number;
  [SOCCER_CLOCK_TIMER.RUNNING]: number;
}

export interface SoccerClockPeriodTimers {
  [SOCCER_CLOCK_PERIOD.FIRST_HALF]: SoccerClockPeriodTimer;
  [SOCCER_CLOCK_PERIOD.MID_BREAK]: SoccerClockPeriodTimer;
  [SOCCER_CLOCK_PERIOD.SECOND_HALF]: SoccerClockPeriodTimer;
  [SOCCER_CLOCK_PERIOD.PENALTIES]: SoccerClockPeriodTimer;
}

export interface SingleSoccerClockState {
  currentPeriod: SOCCER_CLOCK_PERIOD;
  currentTimer: null | SOCCER_CLOCK_TIMER;
  lastTimeSwitched: null | number;
  timers: SoccerClockPeriodTimers;
}

export type SoccerClockState = SingleSoccerClockState;
