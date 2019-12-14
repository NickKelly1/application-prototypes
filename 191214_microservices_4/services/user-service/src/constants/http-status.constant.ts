export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
} as const;
export type HTTP_STATUS = typeof HTTP_STATUS;
export type A_HTTP_STATUS = HTTP_STATUS[keyof HTTP_STATUS];
