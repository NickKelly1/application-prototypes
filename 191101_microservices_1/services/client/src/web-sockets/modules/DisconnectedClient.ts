import { ClientServerSocket } from '../ClientServerSocket';
import { ConnectedClient } from './ConnectdClient';
import { onceify } from '../../../../shared/helpers/onceify';
import { CONNECTION_STATE_DISCONNECTED, CONNECTION_STATE_CONNECTED } from './CLIENT_CONNECTION_STATES';

export class DisconnectedClient implements CONNECTION_STATE_DISCONNECTED {
  public mode = 'disconnected' as const;
  constructor(public uri: string) {}
  connect = onceify((): CONNECTION_STATE_CONNECTED => {
    const server = new ClientServerSocket(io(this.uri));
    return new ConnectedClient(this.uri, server);
  })
}
