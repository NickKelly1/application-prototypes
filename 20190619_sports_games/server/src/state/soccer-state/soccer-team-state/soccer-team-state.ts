import { ValueFrom } from '../../../../@types/helpers';

export const SOCCER_TEAM_NUMBER = { ONE: 'TEAM_ONE', TWO: 'TEAM_TWO' } as const;
export type SOCCER_TEAM_NUMBER = typeof SOCCER_TEAM_NUMBER;

export const SOCCER_TEAM_SIDE = { HOME: 'HOME', AWAY: 'AWAY' } as const;
export type SOCCER_TEAM_SIDE = typeof SOCCER_TEAM_SIDE;

export interface SoccerTeam {
  name: string;
  score: number;
  side: ValueFrom<SOCCER_TEAM_SIDE>;
}

export interface SoccerTeamsState {
  [SOCCER_TEAM_NUMBER.ONE]: SoccerTeam & { number: SOCCER_TEAM_NUMBER['ONE']; order: 1 };
  [SOCCER_TEAM_NUMBER.TWO]: SoccerTeam & { number: SOCCER_TEAM_NUMBER['TWO']; order: 2 };
}
