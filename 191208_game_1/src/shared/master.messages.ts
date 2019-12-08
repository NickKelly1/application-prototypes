export const MASTER_MESSAGE = {
  REQUEST_TYPE_TOKEN: 'request_type_token',
} as const;
export type MASTER_MESSAGE = typeof MASTER_MESSAGE; 
export type A_MASTER_MESSAGE = MASTER_MESSAGE[keyof MASTER_MESSAGE];

export interface MasterMessageMap {
  [MASTER_MESSAGE.REQUEST_TYPE_TOKEN]: { type: MASTER_MESSAGE['REQUEST_TYPE_TOKEN'], payload?: undefined },
}

export type MasterMessage = MasterMessageMap[keyof MasterMessageMap];
