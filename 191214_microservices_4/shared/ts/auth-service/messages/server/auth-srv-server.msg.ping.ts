import { IAuthSrvMsg } from "../auth-srv.msg.interface";

export class AuthSrvServerMsgPing implements IAuthSrvMsg {
  public readonly type = 'PING'
  public readonly sent_utc = Date.now();

  constructor(
    public readonly uuid: string,
    public readonly source_uuid: string,
  ) {}
}
