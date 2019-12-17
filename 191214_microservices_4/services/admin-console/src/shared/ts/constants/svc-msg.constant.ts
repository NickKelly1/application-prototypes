export const SVC_MSG = {
  AUTH_CLIENT: 'au_svc_msg_client',
  AUTH_SERVER: 'au_svc_msg_server',
  CONFIRMED: 'msg_conf',
  EXCEPTION: 'exception',
} as const;
export type SVC_MSG = typeof SVC_MSG;
export type A_SVC_MSG = SVC_MSG[keyof SVC_MSG];
