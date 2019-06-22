const _ = require('lodash');
const BaseClock = require('../../lib/BaseClock');
const CLOCK_STATE = require('../../lib/constants/ClockState');
const SOCKET_MESSAGE = require('../../lib/constants/SocketMessages');
const breakdownTime = require('../../lib/helpers/breakdownTime');
const constrain = require('../../lib/helpers/constrain');
const ClockEvents = require('../../lib/constants/ClockEvents');

// Every 10 Seconds synchronise any listening client clocks
const SYNCHRONISE_INTERVAL = 10000;

class ServerClock extends BaseClock {
  /**
   * @constructor
   *
   * @param {Game} game
   */
  constructor(game) {
    super(game);
    const self = this;

    self.game = game;
    self.reset();

    self.initialising = false;

    // TODO: debug timer for keeping clients up to date
    // self._broadcastInterval = 1000; // TODO: change this back to 10000
    // self._broadcastTimer = setInterval(() => {
    //   self.game.socketHandler.sendMessage('CLOCK', { clock: self.toJSON() }); },
    // self._broadcastInterval);
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

  /**
   * @inheritdoc
   */
  reset() {
    super.init();
    this.emit(ClockEvents.RESET);
  }

  /**
   * @inheritdoc
   */
  _enableTimers() {
    super._enableTimers();

    // timer for keeping ourselves up to date
    if (this._syncTimer === undefined) {
      this._syncTimer = setInterval(() => this._sendSyncUpdate(), SYNCHRONISE_INTERVAL);
    }
  }

  /**
   * @inheritdoc
   */
  _disableTimers() {
    super._disableTimers();
    clearInterval(this._syncTimer);
    this._syncTimer = undefined;
  }

  /**
   * Broadcast a clock synchronisation message to all clients
   */
  _sendSyncUpdate() {
    this.game.socketHandler.sendMessage(SOCKET_MESSAGE.CLOCK_SYNC, { clock_sync: this.toJSON(true) });
  }

  /**
   * @property {number} state setter
   *
   * @description
   * set the game state
   */
  set state(value) {
    const self = this;
    const now = self.currentServerTime;
    let allowChange = false;

    switch (value) {
      // CLOCK_STATE.READY <- Ignore. Handled in reset

      case CLOCK_STATE.RUNNING: {
        // What was the current state of the clock
        switch (self.state) {
          case CLOCK_STATE.READY: {
            self._timeStarted = now;
            self._timeLastPlayed = now;
            allowChange = true;
            break;

            // CLOCK_STATE.RUNNING <- invalid
          }

          case CLOCK_STATE.PAUSED: {
            self._timePaused += now - self._timeLastPaused;
            self._timeElapsed += now - self._timeLastPaused;
            self._timeLastPaused = undefined;
            self._timeLastPlayed = now;
            allowChange = true;
            break;
          }

          case CLOCK_STATE.STOPPED: {
            self._timeStopped += now - self._timeLastStopped;
            self._timeLastStopped = undefined;
            self._timeLastPlayed = now;
            allowChange = true;
            break;
          }

          // CLOCK_STATE.ENDED <- invalid
        }
        break;
      }

      case CLOCK_STATE.PAUSED: {
        // What was the current state of the clock
        switch (self.state) {
          // CLOCK_STATE.READY <- invalid

          case CLOCK_STATE.RUNNING: {
            self._timePlayed += now - self._timeLastPlayed;
            self._timeRemaining -= now - self._timeLastPlayed;
            self._timeElapsed += now - self._timeLastPlayed;
            self._timeLastPlayed = undefined;
            self._timeLastPaused = now;
            allowChange = true;
            break;
          }

          // CLOCK_STATE.PAUSED <- invalid
          // CLOCK_STATE.STOPPED <- invalid
          // CLOCK_STATE.ENDED <- invalid
        }

        break;
      }

      case CLOCK_STATE.STOPPED: {
        // What was the current state of the clock
        switch (self.state) {
          // CLOCK_STATE.READY <- invalid

          case CLOCK_STATE.RUNNING: {
            self._timePlayed += now - self._timeLastPlayed;
            self._timeRemaining -= now - self._timeLastPlayed;
            self._timeElapsed += now - self._timeLastPlayed;
            self._timeLastPlayed = undefined;
            self._timeLastStopped = now;
            allowChange = true;
            break;
          }

          case CLOCK_STATE.PAUSED: {
            self._timePaused += now - self._timeLastPaused;
            self._timeElapsed += now - self._timeLastPaused;
            self._timeLastPaused = undefined;
            self._timeLastStopped = now;
            allowChange = true;
            break;
          }

          // CLOCK_STATE.STOPPED <- invalid

          case CLOCK_STATE.ENDED: {
            self._timeLastStopped = now;
            allowChange = true;
            break;
          }
        }
        break;
      }

      // CLOCK_STATE.ENDED <- Ignore. Handled in endPeriod() function
    }

    if (allowChange) {
      self._state = value;
      self.checkTimers();
      self.emit(ClockEvents.STATE_CHANGED, self._state);
    }
  }

  /**
   * @inheritdoc
   */
  set timeElapsed(value) {
    const self = this;

    // Only allow the change to the clock at various states
    if ([CLOCK_STATE.READY, CLOCK_STATE.STOPPED].includes(self.state)) {
      const newValue = value < 0 ? 0 : value;
      if (newValue !== self._timeElapsed) {
        self._timeElapsed = newValue;
        self.emit(ClockEvents.TIME_ELAPSED_CHANGED, self._timeElapsed);
      }
    }
  }

  /**
   * @description
   * Set the time elapsed values by providing hours, minutes & seconds
   *
   * @param {number} hours
   * @param {number} minutes
   * @param {number} seconds
   * @returns {void}
   */
  setTimeElapsedValues(hours, minutes, seconds) {
    const self = this;
    hours = constrain(_.toInteger(hours || 0), 0, 99);
    minutes = constrain(_.toInteger(minutes || 0), 0, 59);
    seconds = constrain(_.toInteger(seconds || 0), 0, 59);
    self.timeElapsed = hours * 3600000 + minutes * 60000 + seconds * 1000;
  }

  /**
   * @description
   * Set the time elapsed by specifying either the hours, minutes or seconds attribute
   *
   * @param {string} attribute 'hours', 'minutes' or 'seconds'
   * @param {number} value
   * @returns {void}
   */
  setTimeElapsedAttribute(attribute, value) {
    const self = this;

    if (attribute === 'time') {
      self.timeElapsed = _.toInteger(value);
    } else {
      let valid = false;
      const newValue = breakdownTime(self.timeElapsed);
      if (attribute === 'hours') {
        newValue.hours = constrain(value, 0, 99, true);
        valid = true;
      } else if (attribute === 'minutes') {
        newValue.minutes = constrain(value, 0, 59, true);
        valid = true;
      } else if (attribute === 'seconds') {
        newValue.seconds = constrain(value, 0, 59, true);
        valid = true;
      }

      if (valid) {
        self.setTimeElapsedValues(newValue.hours, newValue.minutes, newValue.seconds);
      }
    }
  }

  /**
   * @description
   * Increment an attribute of the time elapsed
   *
   * @param {string} attribute 'hours', 'minutes' or 'seconds'
   * @param {number} byAmount
   * @returns {void}
   */
  incrementTimeElapsed(attribute, byAmount) {
    const self = this;
    let valid = false;
    const value = breakdownTime(self.timeElapsed);

    if (attribute === 'hours') {
      value.hours = constrain(value.hours + byAmount, 0, 99, true);
      valid = true;
    } else if (attribute === 'minutes') {
      value.minutes = constrain(value.minutes + byAmount, 0, 59, true);
      valid = true;
    } else if (attribute === 'seconds') {
      value.seconds = constrain(value.seconds + byAmount, 0, 59, true);
      valid = true;
    }

    if (valid) {
      self.setTimeElapsedValues(value.hours, value.minutes, value.seconds);
    }
  }

  /**
   * @description
   * Set the time played
   *
   * @param {number} value
   * @returns {void}
   */
  set timePlayed(value) {
    const self = this;

    // IF the clock is currently "ended", set the clock to "stopped"
    if (self.state === CLOCK_STATE.ENDED) {
      self.state = CLOCK_STATE.STOPPED;
    }

    // Only allow the change to the clock at various states
    if ([CLOCK_STATE.READY, CLOCK_STATE.PAUSED, CLOCK_STATE.STOPPED].includes(self.state)) {
      const newValue = value < 0 ? 0 : value;
      if (newValue !== self._timePlayed) {
        self._timePlayed = newValue;
        self.emit(ClockEvents.TIME_PLAYED_CHANGED, self._timePlayed);
      }
    }
  }

  /**
   * @description
   * Set the time played by providing hours, minutes & seconds
   *
   * @param {number} hours
   * @param {number} minutes
   * @param {number} seconds
   * @returns {void}
   */
  setTimePlayedValues(hours, minutes, seconds) {
    const self = this;
    hours = constrain(_.toInteger(hours || 0), 0, 99);
    minutes = constrain(_.toInteger(minutes || 0), 0, 59);
    seconds = constrain(_.toInteger(seconds || 0), 0, 59);
    self.timePlayed = hours * 3600000 + minutes * 60000 + seconds * 1000;
  }

  /**
   * @property {number} timeRemaining setter
   *
   * @description
   * set the time remaining
   *
   * @returns {void}
   */
  set timeRemaining(value) {
    const self = this;

    // IF the clock is currently "ended", set the clock to "stopped"
    if (self.state === CLOCK_STATE.ENDED) {
      self.state = CLOCK_STATE.STOPPED;
    }

    // Only allow the change to the clock at various states
    if ([CLOCK_STATE.READY, CLOCK_STATE.PAUSED, CLOCK_STATE.STOPPED].includes(self.state)) {
      const newValue = value < 0 ? 0 : value;
      if (newValue !== self._timeRemaining) {
        self._timeRemaining = newValue;
        self.emit(ClockEvents.TIME_REMAINING_CHANGED, self._timeRemaining);
      }
    }
  }

  /**
   * @description
   * Set the time remaining by providing hours, minutes & seconds
   *
   * @param {number} hours
   * @param {number} minutes
   * @param {number} seconds
   * @returns {void}
   */
  setTimeRemainingValues(hours, minutes, seconds) {
    const self = this;
    hours = constrain(_.toInteger(hours || 0), 0, 99);
    minutes = constrain(_.toInteger(minutes || 0), 0, 59);
    seconds = constrain(_.toInteger(seconds || 0), 0, 59);
    self.timeRemaining = hours * 3600000 + minutes * 60000 + seconds * 1000;
  }

  /**
   * @description
   * Set the time remaining by specifying either the hours, minutes or seconds attribute
   *
   * @param {string} attribute 'hours', 'minutes' or 'seconds'
   * @param {number} value
   * @returns {void}
   */
  setTimeRemainingAttribute(attribute, value) {
    const self = this;

    if (attribute === 'time') {
      self.timeRemaining = _.toInteger(value);
    } else {
      const newValue = breakdownTime(self.timeRemaining);
      let valid = false;
      if (attribute === 'hours') {
        newValue.hours = constrain(value, 0, 99, true);
        valid = true;
      } else if (attribute === 'minutes') {
        newValue.minutes = constrain(value, 0, 59, true);
        valid = true;
      } else if (attribute === 'seconds') {
        newValue.seconds = constrain(value, 0, 59, true);
        valid = true;
      }
      if (valid) {
        self.setTimeRemainingValues(newValue.hours, newValue.minutes, newValue.seconds);
      }
    }
  }

  /**
   * @description
   * Increment an attribute of the time remaining
   *
   * @param {string} attribute 'hours', 'minutes' or 'seconds'
   * @param {number} byAmount
   * @returns {void}
   */
  incrementTimeRemaining(attribute, byAmount) {
    const self = this;
    let valid = false;
    const value = breakdownTime(self.timeRemaining, false);

    if (attribute === 'hours') {
      value.hours = constrain(value.hours + byAmount, 0, 99, true);
      valid = true;
    } else if (attribute === 'minutes') {
      value.minutes = constrain(value.minutes + byAmount, 0, 59, true);
      valid = true;
    } else if (attribute === 'seconds') {
      value.seconds = constrain(value.seconds + byAmount, 0, 59, true);
      valid = true;
    }

    if (valid) {
      self.setTimeRemainingValues(value.hours, value.minutes, value.seconds);
    }
  }

  /**
   * @description
   * Start the clock
   *
   * @returns {void}
   */
  start() {
    this.state = CLOCK_STATE.RUNNING;
  }

  /**
   * @description
   * Pause the clock
   *
   * @returns {void}
   */
  pause() {
    this.state = CLOCK_STATE.PAUSED;
  }

  /**
   * Stop the clock
   *
   * @returns {void}
   */
  stop() {
    this.state = CLOCK_STATE.STOPPED;
  }
}

module.exports = ServerClock;
