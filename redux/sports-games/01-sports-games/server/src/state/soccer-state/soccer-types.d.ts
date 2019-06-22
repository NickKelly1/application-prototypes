import { SoccerTeamState } from './soccer-team-state/soccer-team-types';
import { SoccerTeamActionTypes } from './soccer-team-state/soccer-team-actions';

export interface SoccerState {
  teams: [SoccerTeamState, SoccerTeamState];
}

export type SoccerActionTypes = SoccerTeamActionTypes;
