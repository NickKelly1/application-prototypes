/**
 * @see https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
 */
export class ServerException extends Error implements Error {
  public constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args);
    // Create .stack property on this error
    Error.captureStackTrace(this, ServerException);
  }
}
