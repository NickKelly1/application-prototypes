import { onceify } from '@syntaxfanatics/peon';
import { DisconnectedClient } from './DisconnectedClient';
import { CONNECTION_STATE_CONNECTED, CONNECTION_STATE_DISCONNECTED } from './CLIENT_CONNECTION_STATES';
import { SocketWrapper, SERVER_MESSAGE, CLIENT_MESSAGE } from '@nick-kelly/microservices-prototype-messages';

export class ConnectedClient implements CONNECTION_STATE_CONNECTED {
  public mode = 'connected' as const;
  constructor(public uri: string, public server: SocketWrapper<SERVER_MESSAGE, CLIENT_MESSAGE>) {}
  disconnect = onceify((): CONNECTION_STATE_DISCONNECTED => {
    this.server.disconnect();
    return new DisconnectedClient(this.uri);
  })
}
