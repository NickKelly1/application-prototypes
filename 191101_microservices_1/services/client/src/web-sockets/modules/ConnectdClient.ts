import { DisconnectedClient } from './DisconnectedClient';
import { ClientServerSocket } from '../ClientServerSocket';
import { onceify } from '../../../../shared/helpers/onceify';
import { CONNECTION_STATE_CONNECTED, CONNECTION_STATE_DISCONNECTED } from './CLIENT_CONNECTION_STATES';

export class ConnectedClient implements CONNECTION_STATE_CONNECTED {
  public mode = 'connected' as const;
  constructor(public uri: string, public server: ClientServerSocket) {}
  disconnect = onceify((): CONNECTION_STATE_DISCONNECTED => {
    this.server.disconnect();
    return new DisconnectedClient(this.uri);
  })
}
