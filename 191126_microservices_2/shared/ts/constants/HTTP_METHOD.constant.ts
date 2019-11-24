export const HTTP_METHOD = {
  // get & index
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;
export type HTTP_METHOD = typeof HTTP_METHOD;
