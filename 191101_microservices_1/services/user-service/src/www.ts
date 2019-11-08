import WebSocketStream, {WebSocketDuplex} from "websocket-stream";

process.env.NODE_ENV = 'development';

import http from 'http';
import dbg from 'debug';
import {env} from './env';
import through from 'through2';
import ws from 'websocket-stream';
import Socket = NodeJS.Socket;
import {Transform} from 'stream';


// const debug = dbg('www:server');
function debug(inp1: any, inp2?: any) { console.log(`[DEBUG]::__${inp1}::${inp2 ?? ''}`)}


function normalisePort(val: string | number): string | number {
  const prt = typeof val === 'number' ? val : parseInt(val, 10);
  if (isNaN(prt)) return val;
  if (prt >= 0) return prt;
  throw new TypeError(`Unhandled prt ${prt}`);
}



function handleClose(server: http.Server, prt: string | number) {
  return function doHandleClose() {
    debug('[handleClose]', 'testx');
  }
}



function handleConnection(server: http.Server, prt: string | number) {
  return function doHandleConnection(socket: Socket) {
    debug('[handleConnection]', 'testx');
  }
}



function handleError(server: http.Server, prt: string | number) {
  return function doHandleError(error: Error) {
    // if (error.syscall) {
    //   //
    // }
  }
}



function handleListening(server: http.Server, prt: string | number) {
  return function doHandleListening() {
    const addr = server.address();
    if (addr === null) throw new TypeError('Unhandled addr value - null');
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      :  `address: ${addr.address} - family: ${addr.family} - port: ${addr.port}`;
    debug(`[handleListening] Listening on bind: "${bind}"`, 'testx');
  }
}



function loud() {
  return function transform(buf: any, enc: string, next: (errors: null, data: any) => void) {
    const inp = buf.toString();
    const out = inp.toUpperCase();
    console.log(`[loud] in: ${inp}, out: ${out}`);
    next(null, out);
  };
}


/**
 * HTTP Server
 */
const server = http.createServer(function handler(req, res) {
  debug('[createServer::handler] Handling incoming request...', 'testx');
  req.once('end', function handleReqEnd() { debug('[handler::end]')} );
  req
    .pipe(through(loud()))
    .pipe(res);
});


const port = normalisePort(env.PORT);
server.listen(port);

server.on('close', handleClose(server, port));
server.on('listening', handleListening(server, port));
server.on('connection', handleConnection(server, port));
server.on('error', handleError(server, port));


function webSocketProcessor() {
  return function trans(buf: any, enc: string, next: (errors: null, data: any) => void) {
    const inp = buf.toString();
    const out = inp.toUpperCase();
    console.log(`[loud] in: ${inp}, out: ${out}`);
    next(null, out);
  }
}


/**
 * Web Sockets
 */
ws.createServer({ server }, function handleWebSocket(socketStream: WebSocketDuplex) {
  socketStream
    .pipe(through(webSocketProcessor()))
    .pipe(socketStream)
} as any)

