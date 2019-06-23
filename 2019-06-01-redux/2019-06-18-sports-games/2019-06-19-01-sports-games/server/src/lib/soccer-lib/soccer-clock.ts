import { Clock } from '../clock/clock';

const SOCCER_CLOCK_MODE_NAMES = {
  IDLE_TIME: 'IDLE_TIME' as const,
  PAUSE_TIME: 'PAUSE_TIME' as const,
  RUNNING_TIME: 'RUNNING_TIME' as const,
  BREAK_TIME: 'BREAK_TIME' as const,
};

const soccerClockModes = {
  [SOCCER_CLOCK_MODE_NAMES.IDLE_TIME]: {
    direction: 1 as const,
    time: 0,
  },
  [SOCCER_CLOCK_MODE_NAMES.PAUSE_TIME]: {
    direction: 1 as const,
    time: 0,
  },
  [SOCCER_CLOCK_MODE_NAMES.RUNNING_TIME]: {
    direction: 1 as const,
    time: 0,
  },
  [SOCCER_CLOCK_MODE_NAMES.BREAK_TIME]: {
    direction: 1 as const,
    time: 0,
  },
};

export class SoccerClock {
  private clock: Clock<typeof soccerClockModes>;

  public constructor(currentTimeFunction: () => number = () => Date.now()) {
    this.clock = new Clock(soccerClockModes, SOCCER_CLOCK_MODE_NAMES.IDLE_TIME, currentTimeFunction);
  }

  public start = () => {
    if (this.clock.isRunning) return;
    this.clock.switchMode(SOCCER_CLOCK_MODE_NAMES.RUNNING_TIME);
    this.clock.start();
  };

  public resume = () => {
    if (!this.clock.isRunning) return;
    if (!this.clock.isInMode(SOCCER_CLOCK_MODE_NAMES.PAUSE_TIME)) return;
    this.clock.switchMode(SOCCER_CLOCK_MODE_NAMES.RUNNING_TIME);
  };

  public pause = () => {
    if (!this.clock.isRunning) return;
    if (!this.clock.isInMode(SOCCER_CLOCK_MODE_NAMES.RUNNING_TIME)) return;
    this.clock.switchMode(SOCCER_CLOCK_MODE_NAMES.PAUSE_TIME);
  };

  public stop = () => {
    if (!this.clock.isRunning) return;
    //
  };
}
