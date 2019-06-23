import { SOCCER_TEAM_NUMBERS } from './soccer-team-actions';

export interface SoccerTeam {
  number: SOCCER_TEAM_NUMBERS;
  name: string;
  score: number;
  type: 'home' | 'away';
}

export type SoccerTeamsState = [SoccerTeam, SoccerTeam];
