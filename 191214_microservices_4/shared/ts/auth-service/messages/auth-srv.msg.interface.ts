export interface IAuthSrvMsg {
  readonly type: string;
  readonly uuid: string;
  readonly source_uuid: string;
  readonly sent_utc: number;
}
