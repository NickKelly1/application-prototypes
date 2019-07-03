import { ValueFrom } from '../../../../@types/helpers';
import {
  SOCCER_CLOCK_PERIOD,
  SOCCER_CLOCK_TIMER,
  SingleSoccerClockState,
  SoccerClockState,
} from './soccer-clock-state';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { soccerClockReducer } from './soccer-clock-reducer';
import { createStore } from '../../../lib/store/store';
import { InvalidStateChangeException } from '../../../exceptions/invalid-state-change-exception';
import { soccerClockActions } from './soccer-clock-actions';
import { soccerClockTestHelpers } from './_soccer-clock-test-helpers.test';

describe('Soccer Clock Actions', () => {
  describe('newGame', () => {
    const { store } = soccerClockTestHelpers.setup();

    it('can be created', () => {
      const now = Date.now();
      soccerClockActions.newGame(soccerClockTestHelpers.soccerClockStateFactory())(store.dispatch, store.getState);
    });
  });
  describe('beginGame', () => {
    it('can be fired', () => {
      //
    });
  });
  describe('haltGame', () => {
    it('can be fired', () => {
      //
    });
  });
  describe('pauseGame', () => {
    it('can be fired', () => {
      //
    });
  });
  describe('resumeGame', () => {
    it('can be fired', () => {
      //
    });
  });
  describe('nextPeriod', () => {
    it('transitions periods', () => {
      //
    });
  });
});
