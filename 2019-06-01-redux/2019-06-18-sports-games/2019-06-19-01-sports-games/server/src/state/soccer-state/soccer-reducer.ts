import { Reducer } from '../../lib/store/store.types';
import { SoccerState } from './soccer-state';
import { SoccerEventPayloads } from './soccer-events';
import { soccerClockReducer } from './soccer-clock-state/soccer-clock-reducer';
import { soccerTeamReducer } from './soccer-team-state/soccer-team-reducer';

/**
 * @description
 * Soccer reducer
 */
export const soccerReducer: Reducer<SoccerState, SoccerEventPayloads> = (
  state: SoccerState,
  action: SoccerEventPayloads,
): SoccerState => {
  return {
    clock: soccerClockReducer(state.clock, action),
    teams: soccerTeamReducer(state.teams, action),
  };
};
