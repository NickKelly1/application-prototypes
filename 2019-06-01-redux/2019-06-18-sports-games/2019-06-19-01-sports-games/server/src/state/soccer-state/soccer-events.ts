import { SOCCER_CLOCK_PERIOD, SOCCER_CLOCK_TIMER, SoccerClockState } from './soccer-clock-state/soccer-clock-state';
import { ValueFrom } from '../../../@types/helpers';
import { SOCCER_TEAM_NUMBER, SoccerTeam } from './soccer-team-state/soccer-team-state';

export enum SOCCER_EVENT {
  NEW_GAME = 'NEW_GAME',
  BEGIN_GAME = 'BEGIN_GAME',
  SWITCH_CLOCK_TIMER = 'SWITCH_CLOCK_TIMER',
  SWITCH_CLOCK_PERIOD = 'SWITCH_CLOCK_PERIOD',
  CHANGE_TEAM_NAME = 'CHANGE_TEAM_NAME',
  INCREMENT_TEAM_SCORE = 'INCREMENT_TEAM_SCORE',
}

export type SoccerEventPayloads =
  | {
      type: SOCCER_EVENT.CHANGE_TEAM_NAME;
      payload: {
        teamNumber: ValueFrom<SOCCER_TEAM_NUMBER>;
        newName: SoccerTeam['name'];
      };
    }
  | {
      type: SOCCER_EVENT.INCREMENT_TEAM_SCORE;
      payload: {
        teamNumber: ValueFrom<SOCCER_TEAM_NUMBER>;
        incrementBy: number;
      };
    }
  | {
      type: SOCCER_EVENT.NEW_GAME;
      payload: { now: number; newGameSoccerClockState: SoccerClockState };
    }
  | {
      type: SOCCER_EVENT.BEGIN_GAME;
      payload: { now: number };
    }
  | {
      type: SOCCER_EVENT.SWITCH_CLOCK_TIMER;
      payload: { now: number; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> };
    }
  | {
      type: SOCCER_EVENT.SWITCH_CLOCK_PERIOD;
      payload:  // @note: must include all periods - with timers & without // periods with timers
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['FIRST_HALF']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['MID_BREAK']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['SECOND_HALF']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['PENALTIES']; nextTimer: ValueFrom<SOCCER_CLOCK_TIMER> }
        // periods without timers
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['NOT_STARTED'] }
        | { now: number; nextPeriod: SOCCER_CLOCK_PERIOD['GAME_OVER'] };
    };
