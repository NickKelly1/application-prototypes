
import { IAuthSrvMsg } from "../../messages/auth-srv.msg.interface";
import { AUTH_SRV_CLIENT_MSG_TYPE } from "../auth-srv-client.msg-type";

export class AuthSrvClientMsgPong implements IAuthSrvMsg {
  public readonly type = AUTH_SRV_CLIENT_MSG_TYPE.PONG
  public readonly sent_utc = Date.now();

  constructor(
    public readonly uuid: string,
    public readonly source_uuid: string,
  ) {}
}
