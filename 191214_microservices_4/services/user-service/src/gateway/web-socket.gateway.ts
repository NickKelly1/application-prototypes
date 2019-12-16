import {
  WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, BaseWsExceptionFilter, WebSocketServer,
} from '@nestjs/websockets';
import {
  UseFilters, Catch, WsExceptionFilter, ArgumentsHost,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { uuidv4 } from '@syntaxfanatics/peon';
import { env } from '../env';
import { classLogger } from '../shared/ts/helpers/logger';
import { AN_AUTH_SVC_CLIENT_MSG } from '../shared/ts/auth-service/messages/auth-svc-client.msg';
import { AUTH_SVC_SERVER_MSG } from '../shared/ts/auth-service/messages/auth-svc-server.msg';
import { AUTH_SVC_SERVER_MSG_TYPE } from '../shared/ts/auth-service/messages/auth-svc-server.msg-type';
import { AUTH_SVC_CLIENT_MSG_TYPE } from '../shared/ts/auth-service/messages/auth-svc-client.msg-type';
import { SVC_MSG } from '../shared/ts/constants/svc-msg.constant';

@Catch(Error)
export class WsFilter extends BaseWsExceptionFilter implements WsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('[WsFilter]', exception);
  }
  // catch(exception: Error, host: ArgumentsHost) {
  //   const ctx = host.switchToWs();
  //   const client = ctx.getClient<SocketIO.Socket>();
  //   const data = ctx.getData();
  //   // const status = exception.

  //   console.log('[wsFilter::catch]', { exception, host });

  //   const uuid = uuidv4();
  //   client.emit('message', {
  //     uuid,
  //     sent_utc: Date.now(),
  //     source_uuid: uuid,
  //     type: 'ping',
  //   });
  // }
}


@WebSocketGateway(env.SOCKET_PORT)
@UseFilters(WsFilter)
export class WSS {
  private readonly logger = classLogger(this);

  constructor() {
    this.logger.dInfo('constructor');
  }

  @SubscribeMessage(SVC_MSG.AUTH)
  handleMessage(
    @ConnectedSocket() socket: SocketIO.Socket,
    @MessageBody() data: AN_AUTH_SVC_CLIENT_MSG,
  ) {
    // socket.;
    // socket.sup;
    socket.gay();
    this.logger.dInfo('handleMessage', { data });

    switch (data.type) {
      case AUTH_SVC_CLIENT_MSG_TYPE.PING: {
        const pongUuid = uuidv4();
        console.log('sending...');
        const pong = new AUTH_SVC_SERVER_MSG.PONG(uuidv4(), data.uuid);
        socket.emit(SVC_MSG.AUTH, pong);
        socket.emit(SVC_MSG.CONFIRMED, data.uuid);
        socket.emit(SVC_MSG.CONFIRMED);
        // socket.on('auth-msg', )
        // return pong;
        break;
      }

      default: this.logger.dInfo(`Unhandled message type "${data.type}"`);
        break;
    }
  }
}
