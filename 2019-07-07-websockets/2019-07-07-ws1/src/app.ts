import { Socket, createServer } from 'net';
import { debuglog } from 'util';
import dbg from 'debug';
const debug = dbg('app');

console.log('hello world');

const SOCKET_EVENT = {
  CLOSE: 'close',
  CONNECT: 'connect',
  DATA: 'data',
  DRAIN: 'drain',
  END: 'end',
  ERROR: 'error',
  LOOKUP: 'lookup',
  TIMEOUT: 'timeout',
};

const server = createServer((socket: Socket) => {
  console.log('connection established');
  socket.on(SOCKET_EVENT.CLOSE, () => {
    socket.debug(`socket:${SOCKET_EVENT.CLOSE}`);
  });
  socket.on(SOCKET_EVENT.CONNECT, () => {
    debug(`socket:${SOCKET_EVENT.CONNECT}`);
  });
  socket.on(SOCKET_EVENT.DATA, () => {
    debug(`socket:${SOCKET_EVENT.DATA}`);
  });
  socket.on(SOCKET_EVENT.DRAIN, () => {
    debug(`socket:${SOCKET_EVENT.DRAIN}`);
  });
  socket.on(SOCKET_EVENT.END, () => {
    debug(`socket:${SOCKET_EVENT.END}`);
  });
  socket.on(SOCKET_EVENT.ERROR, () => {
    debug(`socket:${SOCKET_EVENT.ERROR}`);
  });
  socket.on(SOCKET_EVENT.LOOKUP, () => {
    debug(`socket:${SOCKET_EVENT.LOOKUP}`);
  });
  socket.on(SOCKET_EVENT.TIMEOUT, () => {
    debug(`socket:${SOCKET_EVENT.TIMEOUT}`);
  });
});

server.listen('8000', (...args) => {
  debug('listening on port 8000:');
  debug(args);
});

console.log('ella fella');
