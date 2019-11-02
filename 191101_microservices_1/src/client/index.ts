import io from 'socket.io-client';
import { AnyFunc } from '../shared/helpers/type-helpers';
import { ClientServerSocket } from './web-sockets/ClientServerSocket';
import { onceify } from '../shared/helpers/onceify';
import { mapBoth } from '../shared/helpers/either-helpers';
import { clientServerMessageFailHandler, clientServerMessageHandler } from './web-sockets/client-message-handlers';
import { voidify } from '../shared/helpers/voidify';
import { createClientSocketConnection } from './web-sockets/create-client-socket-connection';

const root = document.getElementById('root');
if (!root) throw new ReferenceError('Unable to find the root element');

const conncetion = createClientSocketConnection('localhost:3000').connect();
const { server } = conncetion;
server.on(mapBoth(clientServerMessageFailHandler(server), clientServerMessageHandler(server)));



