import { SoccerTeam, SoccerTeamsState, SOCCER_TEAM_NUMBERS } from './soccer-team-state';
import { SoccerGameActionTypes } from '../soccer-game-state';
import { ThunkAction } from '../../../lib/store/store.types';

export enum SOCCER_TEAM_ACTION_NAMES {
  CHANGE_TEAM_NAME = 'CHANGE_TEAM_NAME',
  INCREMENT_TEAM_SCORE = 'INCREMENT_TEAM_SCORE',
}

export type SoccerTeamActionTypes =
  | {
      type: SOCCER_TEAM_ACTION_NAMES.CHANGE_TEAM_NAME;
      payload: {
        teamNumber: SOCCER_TEAM_NUMBERS;
        newName: SoccerTeam['name'];
      };
    }
  | {
      type: SOCCER_TEAM_ACTION_NAMES.INCREMENT_TEAM_SCORE;
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
): ThunkAction<SoccerTeamsState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_TEAM_ACTION_NAMES.INCREMENT_TEAM_SCORE,
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
): ThunkAction<SoccerTeamsState, SoccerGameActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_TEAM_ACTION_NAMES.CHANGE_TEAM_NAME,
    payload: { teamNumber, newName },
  });
};

export const soccerTeamActions = {
  incrementScore,
  changeName,
};
