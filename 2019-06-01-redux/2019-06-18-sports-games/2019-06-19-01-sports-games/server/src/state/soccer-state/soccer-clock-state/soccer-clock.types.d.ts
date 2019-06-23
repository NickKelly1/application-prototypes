import { SOCCER_CLOCK_PERIODS, SOCCER_CLOCK_MODE } from './soccer-clock-actions';

interface SoccerClockHalfTimer {
  timeRunning: number;
  timePaused: number;
  timeHalted: number;
}

interface SoccerClockMidBreakTimer {
  timeRunning: number;
  timeHalted: number;
}

interface SoccerClockPenaltiesTimer {
  timeRunning: number;
  timeHalted: number;
}

interface SingleSoccerClockState {
  currentPeriod: SOCCER_CLOCK_PERIODS;
  mode: SOCCER_CLOCK_MODE;
  periods: {
    [SOCCER_CLOCK_PERIODS.FIRST_HALF]: SoccerClockHalfTimer;
    [SOCCER_CLOCK_PERIODS.MID_BREAK]: SoccerClockMidBreakTimer;
    [SOCCER_CLOCK_PERIODS.SECOND_HALF]: SoccerClockHalfTimer;
    [SOCCER_CLOCK_PERIODS.PENALTIES]: SoccerClockMidBreakTimer;
  };
}

export interface SoccerClockState {
  new: SingleSoccerClockState;
  current: SingleSoccerClockState;
}
