import SocketIo from 'socket.io';
import { EventEmitter } from 'events';
import { getStringKeysOf } from '../helpers/object-keys';
import { AStringKeyOf } from '../../@types/helper-types';
import { AuthTokenUserMap } from '../models/user-model';
import { hasFunctionProperty } from '../helpers/has-property';
import { SOCKET_CLIENT_MESSAGE } from '../shared/socket-client-messages';
import { SocketServerMessagePayloads } from '../shared/socket-server-messages';
import { SocketClientMessageValidators } from '../socket/socket-client-message-validator';

class ServerSocketListener<
  Messages = SOCKET_CLIENT_MESSAGE,
  Payloads = SocketServerMessagePayloads,
  Validator = SocketClientMessageValidators
> extends EventEmitter {

  /**
   * @constructor
   *
   * @param socket
   * @param validator
   * @param getAuthTokenUserMap
   */
  public constructor(socket: SocketIo.Socket, validator: Validator, getAuthTokenUserMap: () => AuthTokenUserMap) {
    super();
    this.bindSocketMessages(socket, validator, getAuthTokenUserMap);
  }

  private bindSocketMessages = (
    socket: SocketIo.Socket,
    validator: Validator,
    getAuthTokenUserMap: () => AuthTokenUserMap,
  ) => {
    socket.on

    switch () {
      case value:
        
        break;
    
      default:
        break;
    }

    socket.on(message, payload => this.handleReceiveMessage(validator, message, payload, getAuthTokenUserMap));
    switch (key) {
      case value:
        break;

      default:
        break;
    }

    if (!(unknownPayload instanceof Object)) {
      // invalid
      return;
    }

    if (hasFunctionProperty(validator, message)) {
      const errors: string[] = [];
      const z = validator[message](getAuthTokenUserMap(), unknownPayload, errors);
      //
    } else {
      throw new Error('warning!!!');
    }
  };
}
