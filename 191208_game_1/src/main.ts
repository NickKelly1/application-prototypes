import io from 'socket.io';
import http from 'http';
import express from 'express';
import { createMasterStore } from './store/store';
import { socketIOMiddleware } from './middleware/socket-io.middleware';
import { expressMiddleware } from './middleware/express.middleware';

/**
 * @description
 * Create the master process
 */
export function createMasterProcess() {
  console.log('--------------------------------------------------------------');
  console.log('-------------------  BOOTING APPLICATION ---------------------');
  console.log('--------------------------------------------------------------');

  const socketServer = io();
  const expressApp = express();

  // create store
  const store = createMasterStore(socketServer);

  // apply socket server middleware
  socketIOMiddleware(socketServer, store);

  // apply express middleware
  expressMiddleware(expressApp, socketServer, store);

  const httpServer = http.createServer((req, res) => {
    // bind the socket server to the express request
    expressApp(req, res);
  });

  // attach socket server to http server
  socketServer.attach(httpServer);

  const PORT = 4000;
  httpServer.listen(PORT, (...args) => console.log(`[master-process:createMasterProcess] HTTP server running in port ${PORT}`));

  // store.subscribe(function handleStoreAction() {
  //   console.log(`[master-process::handleStoreAction::storeSubscription]`)
  // });

  // start other processes
  return httpServer;
}