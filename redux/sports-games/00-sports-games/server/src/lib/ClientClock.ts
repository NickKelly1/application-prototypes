const _ = require('lodash');
const BaseClock = require('../../lib/BaseClock');
const ClockEvents = require('../../lib/constants/ClockEvents');

// Every 50 Milliseconds determine if the UI needs to be updated with the latest clock state
const UI_FAST_UPDATE_INTERVAL = 50;

// Every second determine if the UI needs to be updated with the latest clock state
const UI_SLOW_UPDATE_INTERVAL = 1000;

class ClientClock extends BaseClock {
  constructor(owner) {
    super(owner);

    this.init();

    this._initialising = false;
    this._serverTimeOffsetSamples = _.fill(new Array(10), 0);
    this._serverTimeOffset = 0;
    this._oldData = {};
  }

  get state() {
    return super.state;
  }

  get periodTime() {
    return super.periodTime;
  }

  get periodEndWarning() {
    return super.periodEndWarning;
  }

  get scoreboardClock() {
    return super.scoreboardClock;
  }

  get timeElapsed() {
    return super.timeElapsed;
  }

  get timeRemaining() {
    return super.timeRemaining;
  }

  get timePlayed() {
    return super.timePlayed;
  }

  get timePaused() {
    return super.timePaused;
  }

  get timeStopped() {
    return super.timeStopped;
  }

  get periodTimeForDisplay() {
    return super.periodTime;
  }

  /**
   * Update this object from another clock object
   * (usually from a clock object in the cached data store)
   * @param {object} clock
   */
  assign(clock) {
    super.assign(clock);

    // Calculate the new time offset between us and the server
    const newOffsetSample = clock.currentTime ? Date.now() - clock.currentTime : 0;
    // this._serverTimeOffsetSamples = [..._.tail(this._serverTimeOffsetSamples), newOffsetSample];
    // this._serverTimeOffset =  _.mean(this._serverTimeOffsetSamples);
    this._serverTimeOffset = newOffsetSample;

    this.updateUI();
  }

  /**
   * Notify the User Interface that the clock elements need to be updated
   * Note: THIS HAS BEEN CAREFULLY CRAFTED TO BE AS LIGHTWEIGHT AS POSSIBLE
   */
  updateUI() {
    const timeRemainingSnapped = Math.ceil(this.timeRemaining / 1000) * 1000;
    const timeElapsedSnapped = Math.floor(this.timeElapsed / 1000) * 1000;
    const currentTimeSnapped = Math.floor(this.currentServerTime / 1000) * 1000;

    if (
      // Is the clock state different
      this._oldData.state !== this._state ||
      // Has the time changed within a 1 second resolution?
      this._oldData.timeRemainingSnapped !== timeRemainingSnapped ||
      this._oldData.timeElapsedSnapped !== timeElapsedSnapped ||
      this._oldData.currentTimeSnapped !== currentTimeSnapped
    ) {
      this._oldData = {
        timeRemainingSnapped,
        timeElapsedSnapped,
        currentTimeSnapped,
        state: this._state,
      };
      this.emit(ClockEvents.UPDATE_UI);
    }
  }

  /**
   * @inheritdoc
   */
  _enableTimers() {
    super._enableTimers();

    // Turn off the Slow UI update
    clearInterval(this._uiSlowUpdateTimer);
    this._uiSlowUpdateTimer = undefined;

    // Start the Fast UI update
    if (this._uiFastUpdateTimer === undefined) {
      this._uiFastUpdateTimer = setInterval(() => this.updateUI(), UI_FAST_UPDATE_INTERVAL);
    }
  }

  /**
   * @inheritdoc
   */
  _disableTimers() {
    super._disableTimers();

    // Turn off the Slow UI update
    clearInterval(this._uiFastUpdateTimer);
    this._uiFastUpdateTimer = undefined;

    // Start the Slow UI update
    if (this._uiSlowUpdateTimer === undefined) {
      this._uiSlowUpdateTimer = setInterval(() => this.updateUI(), UI_SLOW_UPDATE_INTERVAL);
    }
  }

  /**
   * Get the current server time
   */
  get currentServerTime() {
    // Override the super.currentServerTime() by offsetting the
    // local time with the server time offset
    return Date.now() - this._serverTimeOffset;
  }
}

module.exports = ClientClock;
