import { SoccerTeamsState } from './soccer-team-state/soccer-team-state';
import { SoccerClockState } from './soccer-clock-state/soccer-clock-state';

export interface SoccerGameState {
  teams: SoccerTeamsState;
  clock: SoccerClockState;
}
