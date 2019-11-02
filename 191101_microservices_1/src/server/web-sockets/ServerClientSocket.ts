import { Socket } from 'socket.io';
import { TypedEvent } from '@syntaxfanatics/peon';
import { Either, right, left } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { mapBoth } from '../../shared/helpers/either-helpers';
import { CLIENT_MESSAGE_VALIDATOR_MAP, CLIENT_MESSAGE } from '../../shared/messages/CLIENT_SOCKET_MESSAGES';
import { MESSAGE_FAILURE, messagePreprocessorFactory } from '../../shared/messages/SOCKET_MESSAGES';
import { SERVER_MESSAGE } from '../../shared/messages/SERVER_SOCKET_MESSAGES';
import { AnyFunc } from '../../shared/helpers/type-helpers';


const preprocessClientMessage = messagePreprocessorFactory(CLIENT_MESSAGE_VALIDATOR_MAP);



/**
 * Server Client Socket wrapper
 */
export class ServerClientSocket extends TypedEvent<Either<MESSAGE_FAILURE, CLIENT_MESSAGE>> {
  socket: Socket;
  disconnectListeners: AnyFunc[] = []

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    this.handleMessage = this.handleMessage.bind(this);
    this.handleFailedMessage = this.handleFailedMessage.bind(this);
    this.handleUnknownMessage = this.handleUnknownMessage.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    socket.on('disconnect', this.handleDisconnect);
    socket.on('message', this.handleUnknownMessage);
  }



  /**
   * Send a message over socket
   *
   * @param message
   */
  send(message: SERVER_MESSAGE) {
    console.log('[ServerClientSocket::send] sending message', message);
    this.socket.send(message);
  }



  /**
   * Handle the socket disconnecting
   */
  handleDisconnect() {
    console.log('[ServerClientSocket::handleDisconnect]');
    this.disconnectListeners.forEach(fn => fn());
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
  handleMessage(message: CLIENT_MESSAGE) {
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
      preprocessClientMessage(unknownMessage),
      mapBoth(
        this.handleFailedMessage,
        this.handleMessage,
      )
    );
  }
}
