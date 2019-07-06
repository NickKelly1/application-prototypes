import { soccerTeamActions } from './soccer-team-actions';
import { soccerTeamReducer } from './soccer-team-reducer';
import { createStore } from '../../../lib/store/store';
import { SoccerTeamsState, SOCCER_TEAM_NUMBERS } from './soccer-team-state';
import { SoccerEventPayloads, SOCCER_EVENTS } from '../soccer-game-events';

const setup = () => {
  const initialState: SoccerTeamsState = [
    {
      number: SOCCER_TEAM_NUMBERS.ONE,
      name: 'Home-side Hamsters',
      score: 0,
      type: 'home',
    },
    {
      number: SOCCER_TEAM_NUMBERS.TWO,
      name: 'Away-side Aardvarks',
      score: 0,
      type: 'away',
    },
  ];

  const store = createStore<SoccerTeamsState, SoccerEventPayloads>(initialState, [soccerTeamReducer]);

  return {
    initialState,
    store,
  };
};

describe('Soccer State', () => {
  it(`should change teams name when "${SOCCER_EVENTS.CHANGE_TEAM_NAME}" is fired`, () => {
    const { initialState, store } = setup();

    // target
    const targetTeamNumber = SOCCER_TEAM_NUMBERS.TWO;
    const targetTeamIndex = initialState.findIndex(team => team.number === targetTeamNumber);

    // other
    const otherTeamNumber = SOCCER_TEAM_NUMBERS.ONE;
    const otherTeamIndex = initialState.findIndex(team => team.number === otherTeamNumber);

    // change parameters
    const otherTeamName = store.getState()[otherTeamIndex].name;
    const oldTargetTeamName = initialState[targetTeamIndex].name;
    const newTargetTeamName = 'new team name';

    // before dispatch
    expect(store.getState()[targetTeamIndex].name).toBe(oldTargetTeamName);
    expect(store.getState()[otherTeamIndex].name).toBe(otherTeamName);
    soccerTeamActions.changeName(targetTeamNumber, newTargetTeamName)(store.dispatch, store.getState);
    // after dispatch
    expect(store.getState()[targetTeamIndex].name).toBe(newTargetTeamName);
    expect(store.getState()[otherTeamIndex].name).toBe(otherTeamName);
  });

  it(`should increment score when "${SOCCER_EVENTS.INCREMENT_TEAM_SCORE}" is fired`, () => {
    const { initialState, store } = setup();

    // target
    const targetTeamNumber = SOCCER_TEAM_NUMBERS.TWO;
    const targetTeamIndex = initialState.findIndex(team => team.number === targetTeamNumber);

    // other
    const otherTeamNumber = SOCCER_TEAM_NUMBERS.ONE;
    const otherTeamIndex = initialState.findIndex(team => team.number === otherTeamNumber);

    // change parameters
    const otherTeamScore = initialState[otherTeamIndex].score;
    const oldTargetTeamScore = initialState[targetTeamIndex].score;
    const incrementBy = 5;
    const newTargetTargetScore = oldTargetTeamScore + incrementBy;

    // before dispatch
    expect(store.getState()[targetTeamIndex].score).toBe(oldTargetTeamScore);
    expect(store.getState()[otherTeamIndex].score).toBe(otherTeamScore);
    soccerTeamActions.incrementScore(targetTeamNumber, incrementBy)(store.dispatch, store.getState);
    // after dispatch
    expect(store.getState()[targetTeamIndex].score).toBe(newTargetTargetScore);
    expect(store.getState()[otherTeamIndex].score).toBe(otherTeamScore);
  });
});
