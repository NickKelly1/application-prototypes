import { ImmutableSet } from "@syntaxfanatics/peon";
import { Store } from 'redux';
import { Player } from "../resources/player.entity";
import { MasterAction } from "./store.actions";

export interface MasterState {
  players: ImmutableSet<Player>;
  connectedSockets: ImmutableSet<SocketIO.Socket>;
}

export type MasterStore = Store<MasterState, MasterAction>;

export const initialMasterState: MasterState = {
  players: new ImmutableSet(),
  connectedSockets: new ImmutableSet(),
};
