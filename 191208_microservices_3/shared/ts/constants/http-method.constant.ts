export const HTTP_METHOD = {
  // get & index
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;
export type HTTP_METHOD = typeof HTTP_METHOD;
export type A_HTTP_METHOD = HTTP_METHOD[keyof HTTP_METHOD];
