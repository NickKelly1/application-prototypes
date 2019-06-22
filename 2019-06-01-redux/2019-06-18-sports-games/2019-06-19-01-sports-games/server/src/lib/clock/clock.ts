import { ClockMode } from './clock.types';
import { $TS_FIX_ME } from '../../../@types/ts-fix-me';

export class Clock<K extends string, ModeMap extends Record<K, ClockMode>> {
  public modes: ModeMap;
  public lastTimeSwitched: number;

  private _currentMode: keyof ModeMap;
  private _isRunning: boolean;
  private _currentTimeFunction: () => number;

  /**
   * @constructor
   *
   * @param modes
   * @param currentMode
   * @param currentTimeFunction allow for custom time getting function (inc. mocking)
   */
  public constructor(modes: ModeMap, currentMode: keyof ModeMap, currentTimeFunction: () => number = () => Date.now()) {
    this.modes = modes;
    this.lastTimeSwitched = -1;
    this._currentMode = currentMode;
    this._isRunning = false;
    this._currentTimeFunction = currentTimeFunction;
  }

  /**
   * @description
   * Has the clock started?
   */
  public get isRunning() {
    return this._isRunning;
  }

  /**
   * @description
   * The current mode of the clock
   * Can only be switched via Cock.prototype.switchMode
   */
  public get currentMode() {
    return this._currentMode;
  }

  /**
   * @description
   * Switch to a nextMode
   *
   * @param nextMode
   */
  public switchMode = (nextMode: keyof ModeMap) => {
    if (!this._isRunning) {
      this._currentMode = nextMode;
      return;
    }

    const now = this._currentTimeFunction();
    // cache time for the previous mode and move to the next
    this.modes[this.currentMode].time += Clock.getSwitchDifference(
      this.modes[this.currentMode],
      this.lastTimeSwitched,
      this._currentTimeFunction(),
    );
    this.lastTimeSwitched = now;
    this._currentMode = nextMode;
  };

  /**
   * @description
   * Get the cached time of a mode
   * (if this is the active mode, add the time the mode has been running for)
   *
   * @param modeKey
   */
  public getModeTime = (modeKey: keyof ModeMap) => {
    if (!this._isRunning || modeKey !== this.currentMode) return this.modes[modeKey].time;
    return (
      this.modes[modeKey].time +
      Clock.getSwitchDifference(this.modes[modeKey], this.lastTimeSwitched, this._currentTimeFunction())
    );
  };

  /**
   * @description
   * Get the time for each mode
   */
  public getModeTimes = (): Map<keyof ModeMap, number> =>
    new Map(
      Object.keys(this.modes).map<[keyof ModeMap, number]>(mode => [
        mode as $TS_FIX_ME<keyof ModeMap>,
        this.getModeTime(mode as $TS_FIX_ME<keyof ModeMap>),
      ]),
    );

  /**
   * @description
   * Start the clock
   */
  public start = () => {
    this.lastTimeSwitched = this._currentTimeFunction();
    this._isRunning = true;
  };

  /**
   * @description
   * Get the difference between the last time switched and now
   * from the perspective of a given mode
   *
   * @param mode
   * @param lastTimeSwitched
   * @param now
   */
  private static getSwitchDifference = (mode: ClockMode, lastTimeSwitched: number, now: number) =>
    mode.direction * (now - lastTimeSwitched);
}
