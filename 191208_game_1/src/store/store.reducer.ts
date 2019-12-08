import { Reducer } from "redux"
import { MasterState, initialMasterState } from "./store.state"
import { MasterAction, MASTER_ACTION_TYPE } from "./store.actions"

/**
 * @description
 * Master reducer
 * 
 * @param state 
 * @param action 
 */
export const masterReducer: Reducer<MasterState, MasterAction> = (state = initialMasterState, action) => {
  console.log(`[masterReducer::action]: ${action.type}`);

  switch (action.type) {
    case MASTER_ACTION_TYPE.CONNECT_SOCKET: {
      return {
        ...state,
        connectedSockets: state.connectedSockets.add(action.payload.socket),
      }
    }
    case MASTER_ACTION_TYPE.DISCONNECT_SOCKET: {
      return {
        ...state,
        connectedSockets: state.connectedSockets.delete(action.payload.socket),
      }
    }
    case MASTER_ACTION_TYPE.REGISTER_PLAYER: {
      return {
        ...state,
        players: state.players.add(action.payload.player),
      }
    }
    case MASTER_ACTION_TYPE.NOOP: return state;
    default: return state;
  }
}