import { runSocketIoServer } from './socketio/socketio-server';

const { httpServer, socketServer } = runSocketIoServer();

console.log('ran server...');
