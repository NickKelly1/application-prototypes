import { IAuthSrvMsg } from '../../messages/auth-srv.msg.interface';

export class AuthSrvClientMsgPing implements IAuthSrvMsg {
  public readonly type = 'PING'
  public readonly sent_utc = Date.now();

  constructor(
    public readonly uuid: string,
    public readonly source_uuid: string,
  ) {}
}
