import { DisconnectedClient } from './modules/DisconnectedClient';

export function createClientSocketConnection(uri: string) {
  return new DisconnectedClient(uri);
}
