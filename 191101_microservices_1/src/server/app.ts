import http from 'http';
import express from 'express';
import cors from 'cors';
import socketIo, { Client } from 'socket.io';
// import { ORDER_ROUTES } from '../shared/domains/orders/ORDER_ROUTES';
import { ServerClientSocket } from './web-sockets/ServerClientSocket';
import { mapBoth } from '../shared/helpers/either-helpers';
import { serverClientMessageFailHandler, serverClientMessageHandler } from './web-sockets/server-message-handlers';
import { SERVER_MESSAGES } from '../shared/messages/SERVER_SOCKET_MESSAGES';

// const app = express();
// const httpServer = http.createServer(app);
const httpServer = http.createServer();
const io = socketIo(httpServer, { origins: '*:*' });

const router = express.Router();

const data = {
  data: {
    hello: 'world'
  },
  meta: {}
};

router.get('/data', (req, res, next) => {
  res.status(200).json(data);
  next();
});

// router.get(ORDER_ROUTES.INDEX.template)

let clientCount = 0;
const clients = [];

io.on('connection', (socket) => {
  clientCount += 1;
  console.log(`[app::io::on] client ${clientCount} connected`);
  const client = new ServerClientSocket(socket);
  client.on(mapBoth(serverClientMessageFailHandler(io, client), serverClientMessageHandler(io, client)));

  // const interval = setInterval(() => {
  //   console.log('[app::io::on::setInterval] pinging client...');
  //   return void client.send({ type: SERVER_MESSAGES.TYPE.PING, payload: {}});
  // }, 3000);

  // client.onDisconnect(() => {
  //   clearInterval(interval);
  // })
});


// bind socketio to the app
// app.use(router);
const PORT = 3000;
// app.listen(PORT, () => console.log(`listening on port ${PORT}`));
httpServer.listen({ port: PORT }, () => console.log(`http server running on port ${PORT}...`));
// httpServer.listen();

