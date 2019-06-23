import { SoccerTeamsState } from './soccer-team-state/soccer-team.types';
import { SoccerTeamActionTypes } from './soccer-team-state/soccer-team-actions';
import { SoccerClockActionTypes } from './soccer-clock-state/soccer-clock-actions';
import { SoccerClockState } from './soccer-clock-state/soccer-clock.types';

export interface SoccerGameState {
  teams: SoccerTeamsState;
  clock: SoccerClockState;
}

export type SoccerGameActionTypes = SoccerTeamActionTypes | SoccerClockActionTypes;
