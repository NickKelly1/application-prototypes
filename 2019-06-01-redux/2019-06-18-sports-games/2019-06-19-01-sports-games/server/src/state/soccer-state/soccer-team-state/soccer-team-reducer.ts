import { SoccerTeamsState, SOCCER_TEAM_NUMBERS } from './soccer-team-state';
import { Reducer } from '../../../lib/store/store.types';
import { SoccerEventPayloads, SOCCER_EVENTS } from '../soccer-game-events';

export const soccerTeamReducer: Reducer<SoccerTeamsState, SoccerEventPayloads> = (
  state: SoccerTeamsState,
  action: SoccerEventPayloads,
): SoccerTeamsState => {
  switch (action.type) {
    case SOCCER_EVENTS.CHANGE_TEAM_NAME:
      return [
        // team 1
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.ONE ? { ...state[0], name: action.payload.newName } : state[0],
        // team 2
        action.payload.teamNumber === SOCCER_TEAM_NUMBERS.TWO ? { ...state[1], name: action.payload.newName } : state[1],
      ];

    case SOCCER_EVENTS.INCREMENT_TEAM_SCORE:
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
