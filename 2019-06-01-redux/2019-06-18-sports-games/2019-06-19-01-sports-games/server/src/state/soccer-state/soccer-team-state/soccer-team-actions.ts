import { SoccerTeam, SoccerTeamsState } from './soccer-team.types';
import { SoccerGameActionTypes } from '../soccer-game.types';
import { ThunkAction } from '../../../lib/store/store.types';

export enum SOCCER_TEAM_ACTION_NAMES {
  CHANGE_NAME = 'CHANGE_NAME',
  INCREMENT_SCORE = 'INCREMENT_SCORE',
}

export enum SOCCER_TEAM_NUMBERS {
  ONE = 'TEAM_ONE',
  TWO = 'TEAM_TWO',
}

export type SoccerTeamActionTypes =
  | {
      type: SOCCER_TEAM_ACTION_NAMES.CHANGE_NAME;
      payload: {
        teamNumber: SOCCER_TEAM_NUMBERS;
        newName: SoccerTeam['name'];
      };
    }
  | {
      type: SOCCER_TEAM_ACTION_NAMES.INCREMENT_SCORE;
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
    type: SOCCER_TEAM_ACTION_NAMES.INCREMENT_SCORE,
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
    type: SOCCER_TEAM_ACTION_NAMES.CHANGE_NAME,
    payload: { teamNumber, newName },
  });
};

export const soccerTeamActions = {
  incrementScore,
  changeName,
};
