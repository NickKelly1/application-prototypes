
import { IAuthSVCMsg } from "../auth-svc.msg.interface";
import { AUTH_SVC_SERVER_MSG_TYPE } from "../auth-svc-server.msg-type";

export class AuthSVCServerMsgPong implements IAuthSVCMsg {
  public readonly type = AUTH_SVC_SERVER_MSG_TYPE.PONG;
  public readonly sent_utc = Date.now();

  constructor(
    public readonly uuid: string,
    public readonly source_uuid: string,
  ) {}
}
