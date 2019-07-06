import { SoccerTeamsState } from './soccer-team-state';
import { Reducer } from '../../../lib/store/store.types';
import { SoccerEventPayloads, SOCCER_EVENT } from '../soccer-events';

export const soccerTeamReducer: Reducer<SoccerTeamsState, SoccerEventPayloads> = (
  state: SoccerTeamsState,
  action: SoccerEventPayloads,
): SoccerTeamsState => {
  switch (action.type) {
    case SOCCER_EVENT.CHANGE_TEAM_NAME:
      return {
        ...state,
        [action.payload.teamNumber]: {
          ...state[action.payload.teamNumber],
          name: action.payload.newName,
        },
      };

    case SOCCER_EVENT.INCREMENT_TEAM_SCORE:
      return {
        ...state,
        [action.payload.teamNumber]: {
          ...state[action.payload.teamNumber],
          score: state[action.payload.teamNumber].score + action.payload.incrementBy,
        },
      };

    default:
      return state;
  }
};
