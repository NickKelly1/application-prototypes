export enum SOCCER_CLOCK_ACTION_NAMES {
  NEW_GAME = 'NEW_GAME',
  BEGIN_GAME = 'BEGIN_GAME',
  HALT_GAME = 'HALT_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  SET_PERIOD = 'SET_PERIOD',
  END_GAME = 'END_GAME',
}

export enum SOCCER_CLOCK_STATUS {
  ACTIVE = 'ACTIVE',
  HALTED = 'HALTED',
  INACTIVE = 'INACTIVE',
}

export enum SOCCER_CLOCK_PERIODS {
  NOT_STARTED = 'NOT_STARTED',
  FIRST_HALF = 'FIRST_HALF',
  MID_BREAK = 'MID_BREAK',
  SECOND_HALF = 'SECOND_HALF',
  PENALTIES = 'PENALTIES',
  GAME_OVER = 'GAME_OVER',
}

const SOCCER_CLOCK_PERIOD_MODES = {
  [SOCCER_CLOCK_PERIODS.NOT_STARTED]: null,
  [SOCCER_CLOCK_PERIODS.FIRST_HALF]: {
    TIME_RUNNING: 'timeRunning' as const,
    TIME_PAUSED: 'timePaused' as const,
    TIME_HALTED: 'timeHalted' as const,
  },
  [SOCCER_CLOCK_PERIODS.MID_BREAK]: {
    TIME_RUNNING: 'timeRunning' as const,
    TIME_HALTED: 'timeHalted' as const,
  },
  [SOCCER_CLOCK_PERIODS.SECOND_HALF]: {
    TIME_RUNNING: 'timeRunning' as const,
    TIME_PAUSED: 'timePaused' as const,
    TIME_HALTED: 'timeHalted' as const,
  },
  [SOCCER_CLOCK_PERIODS.PENALTIES]: {
    TIME_RUNNING: 'timeRunning' as const,
    TIME_HALTED: 'timeHalted' as const,
  },
  [SOCCER_CLOCK_PERIODS.GAME_OVER]: null,
};

type SOCCER_CLOCK_PERIOD_MODES = typeof SOCCER_CLOCK_PERIOD_MODES;

interface SoccerClockHalfTimer {
  modes: { [index: SOCCER_CLOCK_PERIOD_MODES['FIRST_HALF']]: number };
  //   [SOCCER_CLOCK_PERIOD_MODES['FIRST_HALF']['TIME_RUNNING']]: number;
  //   [SOCCER_CLOCK_PERIOD_MODES['FIRST_HALF']['TIME_PAUSED']]: number;
  //   [SOCCER_CLOCK_PERIOD_MODES['FIRST_HALF']['TIME_HALTED']]: number;
  // };
  memory: {
    currentMode: keyof SoccerClockHalfTimer['modes'];
    lastTimeSwitched: null | number;
  };
}

interface SoccerClockMidBreakTimer {
  modes: {
    timeRunning: number;
    timeHalted: number;
  };
  memory: {
    currentMode: keyof SoccerClockMidBreakTimer['modes'];
    lastTimeSwitched: null | number;
  };
}

interface SoccerClockPenaltiesTimer {
  modes: {
    timeRunning: number;
    timeHalted: number;
  };
  memory: {
    currentMode: keyof SoccerClockPenaltiesTimer['modes'];
    lastTimeSwitched: null | number;
  };
}

interface SingleSoccerClockState {
  period: SOCCER_CLOCK_PERIODS;
  mode: SOCCER_CLOCK_STATUS;
  lastTimeHalted: null | number;
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
