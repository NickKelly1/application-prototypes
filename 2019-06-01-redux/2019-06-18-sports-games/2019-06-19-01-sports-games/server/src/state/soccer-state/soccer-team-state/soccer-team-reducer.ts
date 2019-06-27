import { SoccerGameActionTypes } from '../soccer-game.types';
import { SOCCER_TEAM_ACTION_NAMES } from './soccer-team-actions';
import { SoccerTeamsState, SOCCER_TEAM_NUMBERS } from './soccer-team-types';
import { Reducer } from '../../../lib/store/store.types';

export const soccerTeamReducer: Reducer<SoccerTeamsState, SoccerGameActionTypes> = (
  state: SoccerTeamsState,
  action: SoccerGameActionTypes,
): SoccerTeamsState => {
  switch (action.type) {
    case SOCCER_TEAM_ACTION_NAMES.CHANGE_NAME:
      return [
        // team 1
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.ONE ? { ...state[0], name: action.payload.newName } : state[0],
        // team 2
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.TWO ? { ...state[1], name: action.payload.newName } : state[1],
      ];

    case SOCCER_TEAM_ACTION_NAMES.INCREMENT_SCORE:
      return [
        // team 1
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.ONE
          ? { ...state[0], score: state[0].score + action.payload.incrementBy }
          : state[0],
        // team 2
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.TWO
          ? { ...state[1], score: state[1].score + action.payload.incrementBy }
          : state[1],
      ];

    default:
      return state;
  }
};
