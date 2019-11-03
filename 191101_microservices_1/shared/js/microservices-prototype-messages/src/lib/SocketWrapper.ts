import { MESSAGE_FAILURE, MessagePreprocessor } from '../messages/SOCKET_MESSAGES';
import { TypedEvent, AnyFunc } from '@syntaxfanatics/peon';
import { Either, right, left } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { mapBoth } from 'fp-ts-helpers';


type ClientOrServerSocket = SocketIO.Socket | SocketIOClient.Socket;

/**
 * Server Client Socket wrapper
 */
export class SocketWrapper<IM, OM> extends TypedEvent<Either<MESSAGE_FAILURE, IM>> {
  socket: ClientOrServerSocket;
  preprocessMessage: MessagePreprocessor<IM>;
  disconnectListeners: AnyFunc[] = []

  constructor(socket: ClientOrServerSocket, preprocessMessage: MessagePreprocessor<IM>) {
    super();
    this.socket = socket;
    this.preprocessMessage = preprocessMessage;
    this.handleMessage = this.handleMessage.bind(this);
    this.handleFailedMessage = this.handleFailedMessage.bind(this);
    this.handleUnknownMessage = this.handleUnknownMessage.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    socket.on('disconnect', this.disconnect);
    socket.on('message', this.handleUnknownMessage);
  }



  /**
   * Send a message over socket
   *
   * @param message
   */
  send(message: OM) {
    console.log('[SocketWrapper::send] sending message', message);
    this.socket.send(message);
  }



  /**
   * Disconnect the socket
   */
  disconnect() {
    console.log('[SocketWrapper::disconnect]');
    this.disconnectListeners.forEach(fn => fn());
    this.socket.disconnect();
    this.destroy();
  }



  /**
   * Fired when the socket is disconnected
   *
   * @param cb
   */
  onDisconnect(cb: AnyFunc) {
    this.disconnectListeners.push(cb);
    return { dispose: () => void (this.disconnectListeners = this.disconnectListeners.filter(listener => listener !== cb)) }
  }



  /**
   * Handle receipt of a valid message
   *
   * @param message
   */
  handleMessage(message: IM) {
    this.emit(right(message));
  }



  /**
   * Handle a failed message
   *
   * @param fail
   */
  handleFailedMessage(fail: MESSAGE_FAILURE) {
    const description = `[Reason]: ${fail.reason}\n[Description]: ${fail.description}`;
    console.log(description);
    this.emit(left(fail));
  }



  /**
   * Handle receipt of a socket message
   *
   * @param unknownMessage
   */
  handleUnknownMessage(unknownMessage: unknown) {
    pipe(
      this.preprocessMessage(unknownMessage),
      mapBoth(
        this.handleFailedMessage,
        this.handleMessage,
      )
    );
  }
}



