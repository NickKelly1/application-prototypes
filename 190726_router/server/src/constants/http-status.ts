export const HTTP_STATUS = {
  // get & index
  GET: 200,
  CREATED: 201,
  UPDATED: 203,
  DELETED: 204,
  NOT_FOUND: 404,
  INVALID: 422,
} as const;
export type HTTP_STATUS = typeof HTTP_STATUS;
