import io from 'socket.io';
import { EventEmitter } from 'events';
import { SOCKET_CLIENT_EVENT } from '../constants/socket-events';
import { isValidSocketClientMessage } from '../shared/io/sockets/validators/is-valid-socket-client-message';
import {
  SOCKET_CLIENT_MESSAGE_TYPE,
  SocketClientMessageAttemptJoinRoom,
  SocketClientMessageAttemptLogIn,
  SocketClientMessageAttemptLogOut,
  SocketClientMessageAttemptSignUp,
  SocketClientMessageStopTyping,
  SocketClientMessageTyping,
} from '../shared/io/sockets/types/socket-client-message';
import { TypedEventEmitter } from '../helpers/typed-event-emitter';

interface SocketClientMessageTypeMap {
  [SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_JOIN_ROOM]: SocketClientMessageAttemptJoinRoom;
  [SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_LOG_IN]: SocketClientMessageAttemptLogIn;
  [SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_LOG_OUT]: SocketClientMessageAttemptLogOut;
  [SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_SIGN_UP]: SocketClientMessageAttemptSignUp;
  [SOCKET_CLIENT_MESSAGE_TYPE.STOP_TYPING]: SocketClientMessageStopTyping;
  [SOCKET_CLIENT_MESSAGE_TYPE.TYPING]: SocketClientMessageTyping;
}

/**
 * @class
 * @name ClientSocketWrapper
 *
 * @description
 * Wraps the Client Socket
 */
export class ClientSocketWrapper extends TypedEventEmitter<SocketClientMessageTypeMap> {
  private clientSocket: io.Socket;

  /**
   * @constructor
   *
   * @param clientSocket
   */
  public constructor(clientSocket: io.Socket) {
    super();
    this.clientSocket = clientSocket;
    this.bindMessages();
  }

  /**
   * @description
   * Bind socket message listeners
   */
  private bindMessages = () => {
    this.clientSocket.on(SOCKET_CLIENT_EVENT.MESSAGE, this.handleMessageReceived);
  };

  /**
   * @description
   * Unbind socket message listeners
   */
  private unbindMessages = () => {
    this.clientSocket.off(SOCKET_CLIENT_EVENT.MESSAGE, this.handleMessageReceived);
  };

  /**
   * @description
   * Fired when a message is received from the client socket
   *
   * @param payload
   */
  private handleMessageReceived = (payload: unknown) => {
    if (!isValidSocketClientMessage(payload)) {
      // @TODO: logger
      console.log('[ClientSocketWrapper:handleMessageReceived', 'Received invalid payload', payload);
      return;
    }

    console.log('[ClientSocketWrapper:handleMessageReceived', 'Received valid payload', payload);

    this.emit(payload._type, payload);
  };
}
