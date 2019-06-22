import { SOCCER_TEAM_ACTION_NAMES, soccerTeamActions, SOCCER_TEAM_NUMBERS } from './soccer-team-actions';
import { soccerTeamReducer } from './soccer-team-reducer';
import { createStore } from '../../../lib/store/store';
import { SoccerState, SoccerActionTypes } from '../soccer.types';

const setup = () => {
  const initialState: SoccerState = {
    teams: [
      {
        name: 'Home-side Hamsters',
        score: 0,
        type: 'home',
      },
      {
        name: 'Away-side Aardvarks',
        score: 0,
        type: 'away',
      },
    ],
  };

  const store = createStore<SoccerState, SoccerActionTypes>(initialState, [soccerTeamReducer]);

  return {
    initialState,
    store,
  };
};

describe('Soccer State', () => {
  it(`should change teams name when "${SOCCER_TEAM_ACTION_NAMES.CHANGE_NAME}" is fired`, () => {
    const { initialState, store } = setup();

    const targetTeamNumber = SOCCER_TEAM_NUMBERS.ONE;
    const otherTeamNumber = SOCCER_TEAM_NUMBERS.TWO;
    const otherTeamName = store.getState().teams[otherTeamNumber].name;

    const oldTargetTeamName = initialState.teams[targetTeamNumber].name;
    const newTargetTeamName = 'new team name';

    // before dispatch
    expect(store.getState().teams[targetTeamNumber].name).toBe(oldTargetTeamName);
    expect(store.getState().teams[otherTeamNumber].name).toBe(otherTeamName);
    soccerTeamActions.changeName(targetTeamNumber, newTargetTeamName)(store.dispatch, store.getState);
    // after dispatch
    expect(store.getState().teams[targetTeamNumber].name).toBe(newTargetTeamName);
    expect(store.getState().teams[otherTeamNumber].name).toBe(otherTeamName);
  });

  it(`should increment score when "${SOCCER_TEAM_ACTION_NAMES.INCREMENT_SCORE}" is fired`, () => {
    const { initialState, store } = setup();

    const targetTeamNumber = SOCCER_TEAM_NUMBERS.TWO;
    const otherTeamNumber = SOCCER_TEAM_NUMBERS.ONE;

    const otherTeamScore = initialState.teams[otherTeamNumber].score;
    const oldTargetTeamScore = initialState.teams[targetTeamNumber].score;
    const incrementBy = 5;
    const newTargetTargetScore = oldTargetTeamScore + incrementBy;

    // before dispatch
    expect(store.getState().teams[targetTeamNumber].score).toBe(oldTargetTeamScore);
    expect(store.getState().teams[otherTeamNumber].score).toBe(otherTeamScore);
    soccerTeamActions.incrementScore(targetTeamNumber, incrementBy)(store.dispatch, store.getState);
    // after dispatch
    expect(store.getState().teams[targetTeamNumber].score).toBe(newTargetTargetScore);
    expect(store.getState().teams[otherTeamNumber].score).toBe(otherTeamScore);
  });
});
