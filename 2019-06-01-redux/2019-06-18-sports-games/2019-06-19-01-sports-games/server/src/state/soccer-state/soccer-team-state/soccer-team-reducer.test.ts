import { soccerTeamReducer } from './soccer-team-reducer';
import { createStore } from '../../../lib/store/store';
import { SoccerTeamsState, SOCCER_TEAM_NUMBER } from './soccer-team-state';
import { SoccerEventPayloads, SOCCER_EVENT } from '../soccer-events';
import { soccerTestHelpers } from '../soccer-test-helpers.test';

/**
 * @description
 * Setup for tests
 *
 * @param initialState
 */
const setup = (initialState = soccerTestHelpers.createSoccerTeamTestState()) => {
  const store = createStore<SoccerTeamsState, SoccerEventPayloads>(initialState, [soccerTeamReducer]);

  return {
    initialState,
    store,
  };
};

describe('Soccer State', () => {
  it(`should change teams name when "${SOCCER_EVENT.CHANGE_TEAM_NAME}" is fired`, () => {
    Object.values(SOCCER_TEAM_NUMBER).forEach(targetTeamNumber => {
      const { initialState, store } = setup();
      const newTargetTeamName = 'new team name';
      store.dispatch({
        type: SOCCER_EVENT.CHANGE_TEAM_NAME,
        payload: { newName: newTargetTeamName, teamNumber: targetTeamNumber },
      });

      expect(store.getState()).toEqual({
        ...initialState,
        [targetTeamNumber]: { ...initialState[targetTeamNumber], name: newTargetTeamName },
      });
    });
  });

  it(`should increment score when "${SOCCER_EVENT.INCREMENT_TEAM_SCORE}" is fired`, () => {
    Object.values(SOCCER_TEAM_NUMBER).forEach(targetTeamNumber => {
      /**
       * @description
       * Get a random number between 0 and 10 to increment by
       */
      const randIncrement = () => Math.floor(11 * Math.random());
      const randomIncrements = [randIncrement(), randIncrement(), randIncrement(), randIncrement()];
      const { initialState, store } = setup();

      let expectedScore = 0;
      randomIncrements.forEach(incrementBy => {
        store.dispatch({
          type: SOCCER_EVENT.INCREMENT_TEAM_SCORE,
          payload: { incrementBy, teamNumber: targetTeamNumber },
        });

        expectedScore += incrementBy;
        expect(store.getState()).toEqual({
          ...initialState,
          [targetTeamNumber]: { ...initialState[targetTeamNumber], score: expectedScore },
        });
      });
    });
  });
});
