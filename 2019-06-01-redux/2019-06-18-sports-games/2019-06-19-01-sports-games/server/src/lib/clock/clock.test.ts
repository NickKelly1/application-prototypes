import { Clock } from './clock';

const CLOCK_MODE_NAMES = {
  TIMER_ONE: 'TIMER_ONE' as const,
  TIMER_TWO: 'TIMER_TWO' as const,
  TIMER_THREE: 'TIMER_THREE' as const,
};

const setup = () => {
  const clockModes = {
    [CLOCK_MODE_NAMES.TIMER_ONE]: {
      direction: 1 as const,
      time: 0,
    },
    [CLOCK_MODE_NAMES.TIMER_TWO]: {
      direction: -1 as const,
      time: 30,
    },
    [CLOCK_MODE_NAMES.TIMER_THREE]: {
      direction: 1 as const,
      time: 15,
    },
  };

  return {
    clockModes,
  };
};

describe('Clock', () => {
  /**
   * @test
   *
   * @description
   * Clock should successfully start
   */
  it('should start', () => {
    const { clockModes } = setup();

    const startingMode = CLOCK_MODE_NAMES.TIMER_ONE;
    const clock = new Clock(clockModes, startingMode);

    expect(clock.isRunning).toBe(false);
    clock.start();
    expect(clock.isRunning).toBe(true);
  });

  /**
   * @test
   *
   * @description
   * Clock should switch modes
   */
  it('should switch modes', () => {
    const { clockModes } = setup();

    const startingMode = CLOCK_MODE_NAMES.TIMER_ONE;
    const nextMode = CLOCK_MODE_NAMES.TIMER_TWO;
    const clock = new Clock(clockModes, startingMode);

    expect(clock.currentMode).toMatch(startingMode);
    clock.switchMode(CLOCK_MODE_NAMES.TIMER_TWO);
    expect(clock.currentMode).toMatch(nextMode);
  });

  /**
   * @test
   *
   * @description
   * Clock should tick with time
   */
  it('should tick', () => {
    const activeMode = 'ACTIVE' as const;
    const inactiveMode = 'INACTIVE' as const;

    const clockModes = {
      [activeMode]: {
        direction: 1 as const,
        time: 0,
      },
      [inactiveMode]: {
        direction: 1 as const,
        time: 0,
      },
    };

    let currentTime = 0;
    const clock = new Clock(clockModes, activeMode, () => currentTime);
    clock.start();
    expect(clock.getModeTime(activeMode)).toBe(0);
    expect(clock.getModeTime(inactiveMode)).toBe(0);
    currentTime = 50;
    expect(clock.getModeTime(activeMode)).toBe(50);
    expect(clock.getModeTime(inactiveMode)).toBe(0);
    currentTime = 100;
    expect(clock.getModeTimes()).toEqual(new Map([[activeMode, 100], [inactiveMode, 0]]));
  });
});
