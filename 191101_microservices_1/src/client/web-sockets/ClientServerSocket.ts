import { messagePreprocessorFactory, MESSAGE_FAILURE } from '../../shared/messages/SOCKET_MESSAGES';
import { SERVER_MESSAGE, SERVER_MESSAGE_VALIDATOR_MAP } from '../../shared/messages/SERVER_SOCKET_MESSAGES';
import { Either, right, left } from 'fp-ts/lib/Either';
import { TypedEvent } from '@syntaxfanatics/peon';
import { mapBoth } from '../../shared/helpers/either-helpers';
import { pipe } from 'fp-ts/lib/pipeable';
import { CLIENT_MESSAGE } from '../../shared/messages/CLIENT_SOCKET_MESSAGES';

const preprocessServerMessage = messagePreprocessorFactory(SERVER_MESSAGE_VALIDATOR_MAP);



/**
 * Server Client Socket wrapper
 */
export class ClientServerSocket extends TypedEvent<Either<MESSAGE_FAILURE, SERVER_MESSAGE>> {
  socket: SocketIOClient.Socket;

  constructor(socket: SocketIOClient.Socket) {
    super();
    this.socket = socket;
    this.handleMessage = this.handleMessage.bind(this);
    this.handleFailedMessage = this.handleFailedMessage.bind(this);
    this.handleUnknownMessage = this.handleUnknownMessage.bind(this);
    socket.on('message', this.handleUnknownMessage);
  }



  /**
   * Send a message over socket
   *
   * @param message
   */
  send(message: CLIENT_MESSAGE) {
    this.socket.send(message);
  }



  /**
   * Handle receipt of a valid message
   *
   * @param message
   */
  handleMessage(message: SERVER_MESSAGE) {
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
    console.log('[ClientServerSocket::handleUnknownMessage] received message', unknownMessage);
    pipe(
      preprocessServerMessage(unknownMessage),
      mapBoth(
        this.handleFailedMessage,
        this.handleMessage,
      )
    );
  }
}
