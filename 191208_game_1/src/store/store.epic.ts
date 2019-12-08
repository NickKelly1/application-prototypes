import * as op from 'rxjs/operators';
import { Epic, combineEpics, createEpicMiddleware } from 'redux-observable';
import { MasterAction, A_MASTER_ACTION_TYPE, MasterActionMap, MASTER_ACTION_TYPE, NOOP } from "./store.actions";
import { MasterState, MasterStore } from './store.state';
import { fromEvent } from 'rxjs';
import { SOCKET_TYPE } from '../constants/socket-type.constant';
import { MASTER_MESSAGE } from '../shared/master.messages';
import { CLIENT_MESSAGE, ClientMessageMap } from '../shared/client.messages';
import { createPlayer } from '../resources/player.entity';

type MasterEpic<OutputAction extends MasterAction> = Epic<MasterAction, OutputAction, MasterState>

/**
 * @description
 * Verify an action
 *
 * @param type 
 */
function onlyAction<T extends A_MASTER_ACTION_TYPE>(type: T) {
  return function doFilter(action: MasterAction): action is MasterActionMap[T] {
    return action.type === type;
  }
}


/**
 * @description
 * Get a disconnection observable from a socket
 * 
 * @param socket 
 */
function getDisconnection$(socket: SocketIO.Socket) {
  return fromEvent<string>(socket, 'disconnect');
}


/**
 * @description
 * Is the player registration token valid?
 * 
 * @param token 
 */
function isValidPlayerToken(token: any) { return token === 'I\'m a valid token' }



/**
 * @description
 * Register a trusted player
 *
 * Connection -> Registration
 * 
 * @param socketServer 
 * @param store 
 */
function playerRegistrationEpic(socketServer: SocketIO.Server, store: MasterStore) {
  const epic: MasterEpic<
    | MasterActionMap[MASTER_ACTION_TYPE['REGISTER_PLAYER']
    | MASTER_ACTION_TYPE['REGISTRATION_FAILED']]
  > = (
    action$,
    state$,
  ) => action$
    .pipe(
      op.filter(onlyAction(MASTER_ACTION_TYPE.CONNECT_SOCKET)),
      op.filter(action => action.payload.socket.type === SOCKET_TYPE.PLAYER),
      // request token
      op.tap(action => action.payload.socket.emit(MASTER_MESSAGE.REQUEST_TYPE_TOKEN)),
      // listen for response
      op.switchMap(action => fromEvent<ClientMessageMap[CLIENT_MESSAGE['TYPE_TOKEN']]>(
        action.payload.socket,
        CLIENT_MESSAGE.TYPE_TOKEN
      ).pipe(
        op.map((auth): MasterActionMap[
          | MASTER_ACTION_TYPE['REGISTER_PLAYER']
          | MASTER_ACTION_TYPE['REGISTRATION_FAILED']
        ] =>
          isValidPlayerToken(auth.payload.token)
            ? { type: MASTER_ACTION_TYPE.REGISTER_PLAYER, payload: { player: createPlayer({ name: 'unknown' }) } }
            : { type: MASTER_ACTION_TYPE.REGISTRATION_FAILED, payload: { socket: action.payload.socket } }
        ),
      )),
    );

  return epic;
}



/**
 * @description
 * Disconnect an untrusted player
 *
 * Failed registration -> Disconnection
 *
 * @param socketServer 
 * @param store 
 */
function playerRegistrationFailedEpic(socketServer: SocketIO.Server, store: MasterStore) {
  const epic: MasterEpic<NOOP> = (
    action$,
    state$,
  ) => action$
    .pipe(
      op.filter(onlyAction(MASTER_ACTION_TYPE.REGISTRATION_FAILED)),
      op.tap(action => action.payload.socket.disconnect()),
      op.mapTo(NOOP),
    );

  return epic;
}




/**
 * @description
 * Epic for disconnect actions
 *
 * Connection -> Disconnection
 *
 * @param socketServer 
 */
function disconnectionEpic(socketServer: SocketIO.Server, store: MasterStore) {
  const epic: MasterEpic<MasterActionMap[MASTER_ACTION_TYPE['DISCONNECT_SOCKET']]> = (
    action$,
    state$,
  ) => action$
    .pipe(
      op.filter(onlyAction(MASTER_ACTION_TYPE.CONNECT_SOCKET)),
      op.switchMap((action) => getDisconnection$(action.payload.socket).pipe(op.mapTo(action))),
      op.map((action): MasterActionMap[MASTER_ACTION_TYPE['DISCONNECT_SOCKET']] => ({
        type: MASTER_ACTION_TYPE.DISCONNECT_SOCKET,
        payload: { socket: action.payload.socket },
      })),
    );

  return epic;
}



/**
 * @description
 * Create a task epic that may listen to the redux store
 *
 * @param socketServer
 */
export function createMasterStoreEpic(socketServer: SocketIO.Server, store: MasterStore) {
  /**
   * @description
   * Root epic for the store
   * Combines all sub-epics
   */
  const rootEpic: MasterEpic<MasterAction> = combineEpics(
    playerRegistrationEpic(socketServer, store),
    playerRegistrationFailedEpic(socketServer, store),
    disconnectionEpic(socketServer, store),
  );

  return rootEpic;
}


/**
 * @description
 * Epic middleware to apply to redux
 * Pipes actions after they've been reduced
 */
export const epicMiddleware = createEpicMiddleware<MasterAction, MasterAction, MasterState>();
