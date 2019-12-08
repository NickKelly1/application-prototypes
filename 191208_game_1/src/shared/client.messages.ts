export const CLIENT_MESSAGE = {
  TYPE_TOKEN: 'type_token',
} as const;
export type CLIENT_MESSAGE = typeof CLIENT_MESSAGE; 
export type A_CLIENT_MESSAGE = CLIENT_MESSAGE[keyof CLIENT_MESSAGE];

export interface ClientMessageMap {
  [CLIENT_MESSAGE.TYPE_TOKEN]: { type: CLIENT_MESSAGE['TYPE_TOKEN'], payload: { token: string } },
}

export type ClientMessage = ClientMessageMap[keyof ClientMessageMap];
