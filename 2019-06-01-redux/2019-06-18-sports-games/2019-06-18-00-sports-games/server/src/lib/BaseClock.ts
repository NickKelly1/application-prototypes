const _ = require('lodash');
const events = require('events');
const CLOCK_STATE = require('./constants/ClockState');
const SCOREBOARD_CLOCK_MODE = require('./constants/ScoreboardClockMode');
const ifIsSet = require('./helpers/ifIsSet');
const breakdownTime = require('./helpers/breakdownTime');
const ClockEvents = require('./constants/ClockEvents');

// Every 50ms check to see if the game has ended
const CHECK_ENDED_INTERVAL = 50;

/**
 * TIME ELAPSED
 * TIME PLAYED
 * TIME REMAINING
 * TIME PAUSED
 * TIME STOPPED
 */
class BaseClock extends events.EventEmitter {
  constructor(owner) {
    super(owner);

    const self = this;

    self._settings = {
      periodTime: {
        time: 0 * 3600000 + 30 * 60000 + 0 * 1000,
        hours: 0,
        minutes: 30,
        seconds: 0,
      },
      scoreboardClockMode: SCOREBOARD_CLOCK_MODE.REMAINING,
    };

    self._initialising = true;
  }

  /**
   * Miscellaneous Getters
   */
  get state() {
    return this._state;
  }

  get periodTime() {
    return this._settings.periodTime;
  }

  get scoreboardClockMode() {
    return this._settings.scoreboardClockMode;
  }

  get periodEndWarning() {
    return this.timeRemaining < 60 * 1000;
  }

  /**
   * Returns the timer that should be displayed on the scoreboard based
   * on the scoreboard display mode
   */
  get scoreboardClock() {
    const self = this;
    switch (self.scoreboardClockMode) {
      case SCOREBOARD_CLOCK_MODE.REMAINING: {
        return _.ceil(self.timeRemaining / 1000) * 1000;
      }
      case SCOREBOARD_CLOCK_MODE.PLAYED: {
        return _.floor(self.timePlayed / 1000) * 1000;
      }
      case SCOREBOARD_CLOCK_MODE.CURRENT_TIME: {
        const now = new Date(self.currentServerTime);
        return now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000;
      }
      default: {
        return _.floor(self.timeElapsed / 1000) * 1000;
      }
    }
  }

  /**
   * Update this object from another clock object (usually from a clock
   * object in the cached data store)
   * @param {object} clock
   */
  assign(clock) {
    // Clock Properties
    this._state = ifIsSet(clock, 'state', CLOCK_STATE.READY);

    this.checkTimers();

    this._timeStarted = ifIsSet(clock, 'timeStarted', 0);
    this._timeEnded = ifIsSet(clock, 'timeEnded', 0);

    this._timeLastPlayed = ifIsSet(clock, 'timeLastPlayed', undefined);
    this._timePlayed = ifIsSet(clock, 'timePlayed', 0);
    this._timeRemaining = ifIsSet(clock, 'timeRemaining', 0);
    this._timeElapsed = ifIsSet(clock, 'timeElapsed', 0);

    this._timeLastPaused = ifIsSet(clock, 'timeLastPaused', undefined);
    this._timePaused = ifIsSet(clock, 'timePaused', 0);

    this._timeLastStopped = ifIsSet(clock, 'timeLastStopped', undefined);
    this._timeStopped = ifIsSet(clock, 'timeStopped', 0);

    this._settings.scoreboardClockMode = ifIsSet(clock, 'scoreboardClockMode', 0);
    this._settings.periodTime = ifIsSet(clock, 'periodTime', this._settings.periodTime);
  }

  /**
   * Get the object as a JSON structure
   * @param {boolean} forCache whether the json structure is to be used for cache or not
   */
  toJSON(forCache) {
    const self = this;

    if (forCache) {
      return {
        state: self._state,
        timeStarted: self._timeStarted,
        timeEnded: self._timeEnded,
        timeElapsed: self._timeElapsed,
        timeRemaining: self._timeRemaining,
        timePlayed: self._timePlayed,
        timePaused: self._timePaused,
        timeStopped: self._timeStopped,
        timeLastPlayed: self._timeLastPlayed,
        timeLastPaused: self._timeLastPaused,
        timeLastStopped: self._timeLastStopped,
        scoreboardClockMode: self.scoreboardClockMode,
        periodTime: self.periodTime,

        // Note: this value is not recalled from the cache, but is used in the clock_sync messaging
        currentTime: self.currentServerTime,
      };
    }
    const now = new Date();
    return {
      state: self.state,
      periodTime: self.periodTime,
      timeStarted: breakdownTime(self._timeStarted),
      timeEnded: breakdownTime(self._timeEnded),
      timeElapsed: breakdownTime(self.timeElapsed),
      timeRemaining: breakdownTime(self.timeRemaining, false),
      timePlayed: breakdownTime(self.timePlayed),
      timePaused: breakdownTime(self.timePaused),
      timeStopped: breakdownTime(self.timeStopped),
      scoreboardClock: breakdownTime(self.scoreboardClock),
      currentTime: breakdownTime(now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000),
      periodEndWarning: self.periodEndWarning,
    };
  }

  /**
   * Reset the clock to it's initial state
   */
  init() {
    const self = this;

    self._state = CLOCK_STATE.READY;

    self.checkTimers();

    self._timeStarted = 0;
    self._timeEnded = 0;

    self._timeLastPlayed = undefined;
    self._timePlayed = 0;

    self._timeRemaining = self.periodTime.time;

    self._timeLastPaused = undefined;
    self._timePaused = 0;

    self._timeElapsed = 0;

    self._timeLastStopped = undefined;
    self._timeStopped = 0;
  }

  /**
   * Update settings that the clock uses
   */
  applySettings(settings) {
    const self = this;

    self._settings = settings
      ? {
          periodTime: settings.periodTime
            ? {
                time:
                  settings.periodTime.hours * 3600000 +
                  settings.periodTime.minutes * 60000 +
                  settings.periodTime.seconds * 1000,
                hours: settings.periodTime.hours,
                minutes: settings.periodTime.minutes,
                seconds: settings.periodTime.seconds,
              }
            : self.periodTime,
          scoreboardClockMode: settings.scoreboardClockMode ? settings.scoreboardClockMode : self.scoreboardClockMode,
        }
      : self._settings;

    self.checkTimers();
  }

  /**
   * Determine if the timers need to be enabled or disabled
   */
  checkTimers() {
    // Do we have to re-enable any workers?
    if ([CLOCK_STATE.RUNNING, CLOCK_STATE.PAUSED].includes(this.state)) {
      this._enableTimers();
    } else {
      this._disableTimers();
    }
  }

  /**
   * Begin the timers that will maintain client clock synchronisation
   */
  _enableTimers() {
    const self = this;

    // timer for checking if the game has ended
    if (self._checkEndedTimer === undefined) {
      self._checkEndedTimer = setInterval(() => self.checkEnded(), CHECK_ENDED_INTERVAL);
    }
  }

  /**
   * Turn off the timers that keep client clocks synchronised
   */
  _disableTimers() {
    clearInterval(this._checkEndedTimer);
    this._checkEndedTimer = undefined;
  }

  /**
   * Get the current server time
   */
  get currentServerTime() {
    return Date.now();
  }

  /**
   * Calculate the time that has elapsed since play start
   */
  get timeElapsed() {
    switch (this.state) {
      case CLOCK_STATE.PAUSED:
        return this._timeElapsed + (this.currentServerTime - this._timeLastPaused);
      case CLOCK_STATE.RUNNING:
        return this._timeElapsed + (this.currentServerTime - this._timeLastPlayed);
      default:
        return this._timeElapsed;
    }
  }

  /**
   * Calculate the time the period has been in play
   */
  get timePlayed() {
    switch (this.state) {
      case CLOCK_STATE.RUNNING:
        return this._timePlayed + (this.currentServerTime - this._timeLastPlayed);
      default:
        return this._timePlayed;
    }
  }

  /**
   * Calculate the time the period has been stopped
   */
  get timePaused() {
    switch (this.state) {
      case CLOCK_STATE.PAUSED:
        return this._timePaused + (this.currentServerTime - this._timeLastPaused);
      default:
        return this._timePaused;
    }
  }

  /**
   * Calculate the time the period has been stopped
   */
  get timeStopped() {
    switch (this.state) {
      case CLOCK_STATE.STOPPED:
        return this._timeStopped + (this.currentServerTime - this._timeLastStopped);
      default:
        return this._timeStopped;
    }
  }

  /**
   * Calculate the time Remaining
   */
  get timeRemaining() {
    switch (this.state) {
      case CLOCK_STATE.RUNNING:
        return this._timeRemaining - (this.currentServerTime - this._timeLastPlayed);
      default:
        return this._timeRemaining;
    }
  }

  /**
   * Check to see if the clock should be finished
   * @return {boolean} true if the game has ended
   */
  checkEnded() {
    if (this.state === CLOCK_STATE.RUNNING && this.timeRemaining <= 0) {
      this._end();
      return true;
    }
    return false;
  }

  /**
   * Called internally when the clock runs out
   */
  _end() {
    this._state = CLOCK_STATE.ENDED;

    this.checkTimers();
    const now = this.currentServerTime;

    this._timeEnded = now;
    this._timeElapsed += now - this._timeLastPlayed;
    this._timePlayed += now - this._timeLastPlayed;
    this._timeRemaining = 0;

    this.emit(ClockEvents.ENDED);
  }
}

module.exports = BaseClock;
