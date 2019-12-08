import * as op from 'rxjs/operators';
import { Observable } from "rxjs";
import { SOCKET_TYPE, A_SOCKET_TYPE } from '../constants/socket-type.constant';
import { SocketQuery } from '../types/socket-query';
import { MasterStore } from '../store/store.state';
import { MASTER_ACTION_TYPE } from '../store/store.actions';

/**
 * @description
 * What is the type of the socket
 * 
 * @param socket 
 */
function getSocketType(socket: SocketIO.Socket): A_SOCKET_TYPE {
  const providedType = (socket.handshake.query as SocketQuery).type;
  if (Object.values(SOCKET_TYPE).includes(providedType)) return providedType; 
  else return SOCKET_TYPE.UNKNOWN;
}


/**
 * @description
 * Register the SocketIO middleware
 * 
 * @param socketServer 
 */
export function socketIOMiddleware(socketServer: SocketIO.Server, store: MasterStore) {
  // listen for connections -> dispatch events
  const connection$ = new Observable<SocketIO.Socket>(function subscribe(observer) {
    function handler(socket: SocketIO.Socket) { observer.next(socket); }
    socketServer.on('connection', handler);
    // close the socket server when un-subscribing
    return () => socketServer.close();
  }).pipe(op.map(socket => {
    socket.type = getSocketType(socket);
    return socket;
  })).subscribe(socket => {
    store.dispatch({ type: MASTER_ACTION_TYPE.CONNECT_SOCKET, payload: { socket } });
  });
}
