import { runSocketIoServer } from './deprecated/socketio/socketio-server';

const { httpServer, socketServer } = runSocketIoServer();

console.log('ran server...');
