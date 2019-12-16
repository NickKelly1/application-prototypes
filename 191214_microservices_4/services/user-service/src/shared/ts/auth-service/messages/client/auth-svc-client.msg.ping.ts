import { IAuthSVCMsg } from '../../messages/auth-svc.msg.interface';
import { AUTH_SVC_CLIENT_MSG_TYPE } from '../auth-svc-client.msg-type';

export class AuthSVCClientMsgPing implements IAuthSVCMsg {
  public readonly type = AUTH_SVC_CLIENT_MSG_TYPE.PING
  public readonly sent_utc = Date.now();

  constructor(
    public readonly uuid: string,
    public readonly source_uuid: string,
  ) {}
}
