import { ServerException } from './server-exception';

export class InvalidStateChangeException extends ServerException {
  public constructor(
    state: object,
    action: object,
    ...errorConstructorArgs: ConstructorParameters<typeof ServerException>
  ) {
    if (errorConstructorArgs.length === 0) errorConstructorArgs[0] = 'Error: invalid state change attempted';

    errorConstructorArgs[0] +=
      +'\n' +
      '\n---------------------------------' +
      '\n---------------------------------' +
      '\n' +
      `\n${JSON.stringify({ action }, null, 2)}` +
      '\n' +
      '\n---------------------------------' +
      '\n---------------------------------' +
      '\n' +
      `\n${JSON.stringify({ state }, null, 2)}`;

    super(...errorConstructorArgs);
    Error.captureStackTrace(this, InvalidStateChangeException);
  }
}
