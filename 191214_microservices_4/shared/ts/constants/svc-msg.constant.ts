export const SVC_MSG = {
  AUTH: 'message-svc',
  CONFIRMED: 'message-confirmed',
  EXCEPTION: 'exception',
} as const;
export type SVC_MSG = typeof SVC_MSG;
export type A_SVC_MSG = SVC_MSG[keyof SVC_MSG];
