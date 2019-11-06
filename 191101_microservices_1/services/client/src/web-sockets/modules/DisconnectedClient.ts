import io from 'socket.io-client';
import { ConnectedClient } from './ConnectedClient';
import { CONNECTION_STATE_DISCONNECTED, CONNECTION_STATE_CONNECTED } from './CLIENT_CONNECTION_STATES';
import { onceify } from '@syntaxfanatics/peon';
import { SocketWrapper, SERVER_MESSAGE, CLIENT_MESSAGE, wrapSocketOnClient } from '@nick-kelly/microservices-prototype-messages';

export class DisconnectedClient implements CONNECTION_STATE_DISCONNECTED {
  public mode = 'disconnected' as const;
  constructor(public uri: string) {}
  connect = onceify((): CONNECTION_STATE_CONNECTED => {
    const serverSocket = io(this.uri);
    const server = wrapSocketOnClient(serverSocket);
    return new ConnectedClient(this.uri, server);
  })
}
