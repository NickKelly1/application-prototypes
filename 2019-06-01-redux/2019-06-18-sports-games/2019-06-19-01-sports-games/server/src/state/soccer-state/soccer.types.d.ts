import { SoccerTeamState } from './soccer-team-state/soccer-team.types';
import { SoccerTeamActionTypes } from './soccer-team-state/soccer-team-actions';
import { ThunkAction } from '../../lib/store/store.types';

export interface SoccerState {
  teams: [SoccerTeamState, SoccerTeamState];
}

export type SoccerActionTypes = SoccerTeamActionTypes;
