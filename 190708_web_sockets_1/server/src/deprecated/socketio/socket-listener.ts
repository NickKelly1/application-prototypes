import SocketIo from 'socket.io';
import { EventEmitter } from 'events';
import { getStringKeysOf } from '../../helpers/object-keys';
import { AStringKeyOf } from '../../../@types/helpers/helper-types';
import { AuthTokenUserMap } from '../../shared/models/user-model';
import { hasFunctionProperty, hasStringProperty } from '../../helpers/has-property';
import { SOCKET_CLIENT_MESSAGE } from '../shared/socket-client-messages';
import { SocketServerMessagePayloads } from '../shared/socket-server-messages';
import { SocketClientPayloadSanitizer } from '../socket/socket-client-message-validator';

export class ServerSocketWrapper extends EventEmitter {
  /**
   * @constructor
   *
   * @param socket
   * @param sanitizer
   * @param getAuthTokenUserMap
   */
  public constructor(socket: SocketIo.Socket, sanitizer: SocketClientPayloadSanitizer, authTokenUserMap: AuthTokenUserMap) {
    super();
    this.bindSocketMessages(socket, sanitizer, authTokenUserMap);
  }

  private bindSocketMessages = (
    socket: SocketIo.Socket,
    sanitizer: SocketClientPayloadSanitizer,
    authTokenUserMap: AuthTokenUserMap,
  ) => {
    socket.on(SOCKET_CLIENT_MESSAGE.NEW_MESSAGE, unsanitizedPayload => {
      const msg = SOCKET_CLIENT_MESSAGE.NEW_MESSAGE;

      if (!(unsanitizedPayload instanceof Object)) {
        console.warn(`Invalid payload payload for message "${msg}"`, unsanitizedPayload);
        return;
      }

      const sanitizationResult = sanitizer[msg](authTokenUserMap, unsanitizedPayload);
      if (!sanitizationResult.hasErrors) this.emit(msg, sanitizationResult.sanitizedPayload);
      else {
        console.warn(`Sanitization of message "${msg}" failed`, sanitizationResult.errors);
      }
    });
  };
}
