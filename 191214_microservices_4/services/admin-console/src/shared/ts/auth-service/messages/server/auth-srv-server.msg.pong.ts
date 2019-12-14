
import { IAuthSrvMsg } from "../auth-srv.msg.interface";
import { AUTH_SRV_SERVER_MSG_TYPE } from "../auth-srv-server.msg-type";

export class AuthSrvServerMsgPong implements IAuthSrvMsg {
  public readonly type = AUTH_SRV_SERVER_MSG_TYPE.PONG;
  public readonly sent_utc = Date.now();

  constructor(
    public readonly uuid: string,
    public readonly source_uuid: string,
  ) {}
}
