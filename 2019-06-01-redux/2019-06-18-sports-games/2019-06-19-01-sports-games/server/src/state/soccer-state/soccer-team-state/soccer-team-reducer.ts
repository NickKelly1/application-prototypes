import { SoccerState, SoccerActionTypes } from '../soccer.types';
import { SOCCER_TEAM_ACTION_NAMES, SOCCER_TEAM_NUMBERS } from './soccer-team-actions';
import { SoccerTeamState } from './soccer-team.types';
import { Reducer } from '../../../lib/store/store.types';

export const soccerTeamReducer: Reducer<SoccerState, SoccerActionTypes> = (
  state: SoccerState,
  action: SoccerActionTypes,
): SoccerState => {
  switch (action.type) {
    case SOCCER_TEAM_ACTION_NAMES.CHANGE_NAME: {
      const teams: [SoccerTeamState, SoccerTeamState] = [
        // team 1
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.ONE
          ? { ...state.teams[0], name: action.payload.newName }
          : state.teams[0],
        // team 2
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.TWO
          ? { ...state.teams[1], name: action.payload.newName }
          : state.teams[1],
      ];

      return {
        ...state,
        teams: teams,
      };
    }

    case SOCCER_TEAM_ACTION_NAMES.INCREMENT_SCORE: {
      const teams: [SoccerTeamState, SoccerTeamState] = [
        // team 1
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.ONE
          ? { ...state.teams[0], score: state.teams[0].score + action.payload.incrementBy }
          : state.teams[0],
        // team 2
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.TWO
          ? { ...state.teams[1], score: state.teams[1].score + action.payload.incrementBy }
          : state.teams[1],
      ];

      return {
        ...state,
        teams: teams,
      };
    }

    default:
      return state;
  }
};
