import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { uuidv4 } from '@syntaxfanatics/peon';
import { env } from '../env';
import { classLogger } from '../shared/ts/helpers/logger';
import { AN_AUTH_SVC_CLIENT_MSG } from '../shared/ts/auth-service/messages/auth-svc-client.msg';
import { AUTH_SVC_SERVER_MSG } from '../shared/ts/auth-service/messages/auth-svc-server.msg';
import { AUTH_SVC_CLIENT_MSG_TYPE } from '../shared/ts/auth-service/messages/auth-svc-client.msg-type';
import { SVC_MSG } from '../shared/ts/constants/svc-msg.constant';
import { WsFilter } from './web-socket.exception';


@WebSocketGateway(env.SOCKET_PORT)
@UseFilters(WsFilter)
export class WSS {
  private readonly logger = classLogger(this);

  constructor() {
    this.logger.dInfo('constructor');
  }

  /**
   * @description
   * Handles a message from the client
   *
   * @param socket
   * @param data
   */
  @SubscribeMessage(SVC_MSG.AUTH_CLIENT)
  handleMessage(
    @ConnectedSocket() socket: SocketIO.Socket,
    @MessageBody() data: AN_AUTH_SVC_CLIENT_MSG,
  ) {
    this.logger.dInfo('handleMessage', { data });

    switch (data.type) {
      case AUTH_SVC_CLIENT_MSG_TYPE.PING: {
        const pong = new AUTH_SVC_SERVER_MSG.PONG(uuidv4(), data.uuid);
        socket.emit(SVC_MSG.AUTH_SERVER, pong);
        socket.emit(SVC_MSG.CONFIRMED, data.uuid);
        break;
      }

      default: this.logger.dInfo(`Unhandled message type "${data.type}"`);
        break;
    }
  }
}
