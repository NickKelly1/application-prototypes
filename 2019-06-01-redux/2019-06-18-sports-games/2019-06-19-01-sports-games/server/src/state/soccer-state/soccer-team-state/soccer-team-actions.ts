import { SoccerTeam, SoccerTeamsState, SOCCER_TEAM_NUMBERS } from './soccer-team-state';
import { ThunkAction } from '../../../lib/store/store.types';
import { SoccerEventPayloads, SOCCER_EVENTS } from '../soccer-game-events';

export type SoccerTeamActionTypes =
  | {
      type: SOCCER_EVENTS.CHANGE_TEAM_NAME;
      payload: {
        teamNumber: SOCCER_TEAM_NUMBERS;
        newName: SoccerTeam['name'];
      };
    }
  | {
      type: SOCCER_EVENTS.INCREMENT_TEAM_SCORE;
      payload: {
        teamNumber: SOCCER_TEAM_NUMBERS;
        incrementBy: number;
      };
    };

//
// Score Action Creators
//

/**
 * @description
 * Increment a teams score by an amount
 *
 * @param teamNumber
 * @param incrementBy
 */
const incrementScore = (
  teamNumber: SOCCER_TEAM_NUMBERS,
  incrementBy: SoccerTeam['score'],
): ThunkAction<SoccerTeamsState, SoccerEventPayloads> => dispatch => {
  dispatch({
    type: SOCCER_EVENTS.INCREMENT_TEAM_SCORE,
    payload: { teamNumber, incrementBy },
  });
};

/**
 * @description
 * Increment a teams score by an amount
 *
 * @param teamNumber
 * @param incrementBy
 */
const changeName = (
  teamNumber: SOCCER_TEAM_NUMBERS,
  newName: SoccerTeam['name'],
): ThunkAction<SoccerTeamsState, SoccerEventPayloads> => dispatch => {
  dispatch({
    type: SOCCER_EVENTS.CHANGE_TEAM_NAME,
    payload: { teamNumber, newName },
  });
};

export const soccerTeamActions = {
  incrementScore,
  changeName,
};
