import http from 'http';
import express from 'express';
import cors from 'cors';
import socketIo, { Client } from 'socket.io';
import { serverClientMessageFailHandler, serverClientMessageHandler } from './web-sockets/server-message-handlers';
import { mapBoth } from 'fp-ts-helpers';
import { SERVER_MESSAGES, wrapSocketOnServer } from '@nick-kelly/microservices-prototype-messages';
import { isRight, isLeft } from 'fp-ts/lib/Either';

const app = express();
const httpServer = http.createServer(app);
// const io = socketIo(httpServer, { origins: '*:*' });
const io = socketIo(httpServer);
// app.use(cors());

const router = express.Router();

// middleware

// router.get('/', (req, res, next) => {
//   res.status(200).json({ hello: 'world' });
//   next();
// });

// socketio

let clientCount = 0;
const clients = [];

io.on('connection', (socket) => {
  clientCount += 1;
  console.log(`[app::io::on] client ${clientCount} connected`);
  const client = wrapSocketOnServer(socket);
  client.on(mapBoth(serverClientMessageFailHandler(io, client), serverClientMessageHandler(io, client)));

  const interval = setInterval(() => {
    console.log('[app::io::on::setInterval] pinging client...');
    return void client.send({ type: SERVER_MESSAGES.TYPE.PING, payload: {}});
  }, 7500);

  socket.on('disconnect', () => {
    console.log('[SOCKET_DISCONNECTED]: WARNING - SHOULD BE HANDLED BY SOCKET WRAPPER');
    clearInterval(interval);
  })

  client.onDisconnect(() => {
    console.log('socket SAFELY disconnected');
    clearInterval(interval);
  })
});


// bind routes

// app.use(router);

// listen

const PORT = 3000;
httpServer.listen(PORT, () => `HTTP server listening on ${PORT}`);
// app.listen(PORT, () => console.log(`listening on port ${PORT}`));
