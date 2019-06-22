import { SoccerTeamState } from './soccer-team-types';
import { ThunkAction } from '../../../../@types/store';
import { SoccerActionTypes, SoccerState } from '../soccer-types';

export enum SOCCER_TEAM_ACTION_NAMES {
  CHANGE_NAME = 'CHANGE_NAME',
  INCREMENT_SCORE = 'INCREMENT_SCORE',
}

export type SoccerTeamActionTypes =
  | {
      type: SOCCER_TEAM_ACTION_NAMES.CHANGE_NAME;
      payload: {
        teamId: SoccerTeamState['id'];
        newName: SoccerTeamState['name'];
      };
    }
  | {
      type: SOCCER_TEAM_ACTION_NAMES.INCREMENT_SCORE;
      payload: {
        teamId: SoccerTeamState['id'];
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
 * @param teamId
 * @param incrementBy
 */
const incrementScore = (
  teamId: SoccerTeamState['id'],
  incrementBy: SoccerTeamState['score'],
): ThunkAction<SoccerState, SoccerActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_TEAM_ACTION_NAMES.INCREMENT_SCORE,
    payload: { teamId, incrementBy },
  });
};

/**
 * @description
 * Increment a teams score by an amount
 *
 * @param teamId
 * @param incrementBy
 */
const changeName = (
  teamId: SoccerTeamState['id'],
  newName: SoccerTeamState['name'],
): ThunkAction<SoccerState, SoccerActionTypes> => dispatch => {
  dispatch({
    type: SOCCER_TEAM_ACTION_NAMES.CHANGE_NAME,
    payload: { teamId, newName },
  });
};

export const soccerTeamActions = {
  incrementScore,
  changeName,
};
