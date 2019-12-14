
import { IAuthSrvMsg } from "../../messages/auth-srv.msg.interface";

export class AuthSrvClientMsgPong implements IAuthSrvMsg {
  public readonly type = 'PONG'
  public readonly sent_utc = Date.now();

  constructor(
    public readonly uuid: string,
    public readonly source_uuid: string,
  ) {}
}
