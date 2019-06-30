export enum SOCCER_TEAM_NUMBERS {
  ONE = 'TEAM_ONE',
  TWO = 'TEAM_TWO',
}

export interface SoccerTeam {
  number: SOCCER_TEAM_NUMBERS;
  name: string;
  score: number;
  type: 'home' | 'away';
}

export type SoccerTeamsState = [SoccerTeam, SoccerTeam];
