import * as op from 'rxjs/operators';
import { Epic, combineEpics, createEpicMiddleware } from 'redux-observable';
import { MasterAction, A_MASTER_ACTION_TYPE, MasterActionMap, MASTER_ACTION_TYPE } from "./store.actions";
import { MasterState, MasterStore } from './store.state';
import { fromEvent } from 'rxjs';

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


function playerRegistrationEpic() {
  //
}



// function workerRegistrationAction(
//   store: MasterStore,
//   socket: SocketIO.Socket,
//   preferredProcessId?: number
// ): (MasterActionMap[MASTER_ACTION_TYPE['RECONNECT_WORKER']] | MasterActionMap[MASTER_ACTION_TYPE['REGISTER_WORKER']]) {
//   console.log('[workerRegistrationAction]', preferredProcessId);
//   const reconnectingWorker = preferredProcessId && store
//     .getState()
//     .disconnectedWorkers
//     .find(({ processId }) => processId === preferredProcessId);

//   // reconnect or new
//   if (reconnectingWorker) {
//     // reconnect
//     clearTimeout(reconnectingWorker.pruneTimer);
//     console.log('[workerRegistrationAction] reconnecting worker', reconnectingWorker.processId);
//     const worker: RegisteredWorker = {
//       socket,
//       status: WORKER_STATUS.IDLE,
//       processId: reconnectingWorker.processId,
//       connectedAt: reconnectingWorker.connectedAt,
//       reconnectedAt: new Date(),
//     };
//     return { type: MASTER_ACTION_TYPE.RECONNECT_WORKER, payload: { worker } };
//   } else {
//     // new
//     console.log('[workerRegistrationAction] connecting new worker', NEXT_PROCESS_ID + 1);
//     const worker: RegisteredWorker = {
//       socket,
//       status: WORKER_STATUS.IDLE,
//       connectedAt: new Date(),
//       processId: NEXT_PROCESS_ID += 1,
//     };
//     return { type: MASTER_ACTION_TYPE.REGISTER_WORKER, payload: { worker } };
//   }
// }


// /**
//  * @description
//  * Epic for worker registrations
//  * 
//  * @param socketServer 
//  */
// function createWorkerLifeCycleEpics(store: MasterStore, socketServer: SocketIO.Server) {

//   // process a connected socket of type worker
//   const workerConnection$: MasterEpic<
//   MasterActionMap[MASTER_ACTION_TYPE['FAILED_WORKER_AUTH']]
//   | MasterActionMap[MASTER_ACTION_TYPE['RECONNECT_WORKER']]
//   | MasterActionMap[MASTER_ACTION_TYPE['REGISTER_WORKER']]
//   > = (action$, state$) => action$
//     .pipe(
//       op.filter(onlyAction(MASTER_ACTION_TYPE.CONNECTION)),
//       op.filter(action => action.payload.socket.socketType === SOCKET_CLIENT_TYPE.WORKER),
//       // emit challenge
//       op.tap(action => action.payload.socket.emit(MASTER_MESSAGE.CHALLENGE)),
//       // receive challenge
//       op.switchMap(({ payload: { socket } }) => getChallengeResponse$(socket).pipe(
//         op.takeUntil(getDisconnection$(socket)),
//         op.take(1),
//         op.map(challengeResponse => authWorker(challengeResponse.authToken)
//           // trusted
//           ? workerRegistrationAction(store, socket, challengeResponse.preferredProcessId)
//           // untrusted
//           : { type: MASTER_ACTION_TYPE.FAILED_WORKER_AUTH, payload: { socket } } as MasterActionMap[MASTER_ACTION_TYPE['FAILED_WORKER_AUTH']],
//         )
//       )),
//     );

//   const workerDisconnection$: MasterEpic<MasterActionMap[MASTER_ACTION_TYPE['DISCONNECT_WORKER']]> = (action$, state$) => action$
//     .pipe(
//       op.filter(onlyAction(MASTER_ACTION_TYPE.DISCONNECTION)),
//       op.map(action => state$.value.workers.find(worker => worker.socket === action.payload.socket)),
//       op.filter(isNotNullOrUndefined),
//       op.map((worker): MasterActionMap[MASTER_ACTION_TYPE['DISCONNECT_WORKER']] => ({
//         type: MASTER_ACTION_TYPE.DISCONNECT_WORKER,
//         payload: {
//           worker,
//           pruneTimer: setTimeout(() => store.dispatch({
//             type: MASTER_ACTION_TYPE.PRUNE_WORKER,
//             payload: { processId: worker.processId }
//           }), 15000)
//         }
//       })),
//     );

//   // handle a registered worker
//   const registeredWorker$: MasterEpic<NOOP> = (action$, state$) => action$
//     .pipe(
//       op.filter(onlyAction(MASTER_ACTION_TYPE.REGISTER_WORKER)),
//       // notify client of registration
//       op.tap(action => action.payload.worker.socket.emit(MASTER_MESSAGE.REGISTERED, { processId: action.payload.worker.processId })),
//       op.mapTo(NOOP),
//     );

//   return combineEpics(registeredWorker$, workerDisconnection$, workerConnection$);
// }



// /**
//  * @description
//  * Epic for connection actions
//  * 
//  * @param socketServer 
//  */
// function createConnectionEpic(socketServer: SocketIO.Server) {
//   const socketConnectedEpic: MasterEpic<NOOP> = (action$, state$) => action$
//     .pipe(
//       op.filter(onlyAction(MASTER_ACTION_TYPE.CONNECTION)),
//       op.mapTo(NOOP),
//     );

//   return socketConnectedEpic;
// }



/**
 * @description
 * Epic for disconnect actions
 * 
 * @param socketServer 
 */
function disconnectionEpic(socketServer: SocketIO.Server) {
  const socketDisconnectedSteam: MasterEpic<MasterActionMap[MASTER_ACTION_TYPE['DISCONNECT_SOCKET']]> = (action$, state$) => {
    const epic$ = action$
      .pipe(
        op.filter(onlyAction(MASTER_ACTION_TYPE.CONNECT_SOCKET)),
        op.switchMap((action) => getDisconnection$(action.payload.socket).pipe(op.mapTo(action))),
        op.map((action): MasterActionMap[MASTER_ACTION_TYPE['DISCONNECT_SOCKET']] => ({
          type: MASTER_ACTION_TYPE.DISCONNECT_SOCKET,
          payload: { socket: action.payload.socket },
        })),
      );

    return epic$;
  }

  return socketDisconnectedSteam;
}



/**
 * @description
 * Create a task epic that may listen to the redux store
 *
 * @param socketServer
 */
export function createMasterStoreEpic(store: MasterStore, socketServer: SocketIO.Server) {
  /**
   * @description
   * Root epic for the store
   * Combines all sub-epics
   */
  const rootEpic: MasterEpic<MasterAction> = combineEpics(
    disconnectionEpic(socketServer),
  );

  return rootEpic;
}


/**
 * @description
 * Epic middleware to apply to redux
 * Pipes actions after they've been reduced
 */
export const epicMiddleware = createEpicMiddleware<MasterAction, MasterAction, MasterState>();
