import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { env } from '../env';
import { classLogger } from '../helpers/logger';
import { AN_AUTH_SRV_CLIENT_MSG } from '../shared/ts/auth-service/messages/auth-srv-client.msg';
import { AUTH_SRV_SERVER_MSG } from '../shared/ts/auth-service/messages/auth-srv-server.msg';
import { AUTH_SRV_SERVER_MSG_TYPE } from '../shared/ts/auth-service/messages/auth-srv-server.msg-type';
import { AUTH_SRV_CLIENT_MSG_TYPE } from '../shared/ts/auth-service/messages/auth-srv-client.msg-type';

@WebSocketGateway(env.SOCKET_PORT)
export class WebSocketServer {
  private readonly logger = classLogger(this);

  constructor() {
    this.logger.dInfo('constructor');
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: SocketIO.Socket,
    @MessageBody() data: AN_AUTH_SRV_CLIENT_MSG,
  ) {
    this.logger.dInfo('handleMessage', data, AUTH_SRV_CLIENT_MSG_TYPE.PING);

    switch (data.type) {
      case AUTH_SRV_CLIENT_MSG_TYPE.PING: {
        console.log('sending...');
        const uuid = (Math.random() * 10000).toPrecision(0).toString();
        const pong = new AUTH_SRV_SERVER_MSG.PONG(uuid, data.uuid);
        socket.emit('message', pong);
        socket.emit('message-confirmed', data.uuid);
        // return pong;
        break;
      }

      default: this.logger.dInfo(`Unhandled message type "${data.type}"`);
        break;
    }
  }
}
