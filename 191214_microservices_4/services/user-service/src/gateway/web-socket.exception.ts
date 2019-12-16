import { uuidv4 } from '@syntaxfanatics/peon';
import { Catch, WsExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { AUTH_SVC_CLIENT_MSG } from '../shared/ts/auth-service/messages/auth-svc-client.msg';

@Catch(Error)
export class WsFilter extends BaseWsExceptionFilter implements WsExceptionFilter {
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
