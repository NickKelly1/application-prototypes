import React, { createContext, useState, useEffect } from 'react';
import io, { connect } from 'socket.io-client';
import { env } from '../../env';
import { IAuthSrvMsg } from '../../shared/ts/auth-service/messages/auth-srv.msg.interface';
import { AN_AUTH_SRV_CLIENT_MSG } from '../../shared/ts/auth-service/messages/auth-srv-client.msg';
import { AN_AUTH_SRV_SERVER_MSG } from '../../shared/ts/auth-service/messages/auth-srv-server.msg';
import { logger } from '../../shared/ts/helpers/logger';



type AuthServiceContext = {
  send: (msg: AN_AUTH_SRV_CLIENT_MSG) => any,
  sent: { sentAt: Date, confirmedAt: null | Date; val: AN_AUTH_SRV_CLIENT_MSG }[],
  exceptions: { receivedAt: Date, val: unknown}[],
  received: { receivedAt: Date, val: AN_AUTH_SRV_SERVER_MSG}[],
  connected: boolean,
  ws: SocketIOClient.Socket;
};

export const authServiceContext = createContext<AuthServiceContext>(null as any);

const ws = io(`${env.AUTH_SRV_HOST}:${env.AUTH_SRV_WEB_SOCKET_PORT}`, { autoConnect: false });
const cLog = (...args: any[]) => logger.dInfo('[AuthServiceProvider]', ...args);



/**
 * @description
 * Provides network access to the auth service
 * 
 * @param param0 
 */
export const AuthServiceProvider: React.FC = ({ children }) => {
  const [ sent, setSent ] = useState<AuthServiceContext['sent']>([]);
  const [ exceptions, setExceptions ] = useState<AuthServiceContext['exceptions']>([]);
  const [ received, setReceived ] = useState<AuthServiceContext['received']>([]);
  const [ connected, setConnected ] = useState<AuthServiceContext['connected']>(false);


  function send(msg: AN_AUTH_SRV_CLIENT_MSG) {
    cLog('[send]', msg);
    if (connected) {
      ws.emit('message', msg);
      setSent((prev) => prev.concat([{ sentAt: new Date(), confirmedAt: null, val: msg }]));
    } else {
      cLog('[send]', 'Unable to send message: not connected', msg)
    }
  }


  /**
   * Connect listeners on boot
   */
  useEffect(() => {

    // listener
    function onMessage(msg: AN_AUTH_SRV_SERVER_MSG) {
      cLog('[onMessage]', msg);
      setReceived((prev) => prev.concat([{ receivedAt: new Date(), val: msg }]));
    };

    function onMessageConfirmed(uuid: IAuthSrvMsg['uuid']) {
      cLog('[onMessageConfirmed]', uuid);
      setSent((prev) => prev.map(msg => msg.val.uuid === uuid ? ({ ...msg, confirmedAt: new Date() }) : msg));
    };

    function onException(err: unknown) {
      cLog('[onException]', err);
      setExceptions(prev => prev.concat([{ receivedAt: new Date(), val: err }]));
    }


    // bindings
    function onConnection() {
      cLog('[onConnect]');
      ws.on('message', onMessage);
      ws.on('message-confirmed', onMessageConfirmed);
      setConnected(true);
    };

    function onDisconnection() {
      cLog('[onDisconnect]');
      ws.off('message', onMessage);
      ws.off('message-confirmed', onMessageConfirmed);
      setConnected(false);
    };

    ws.on('connect', onConnection);
    ws.on('disconnect', onDisconnection);
    ws.on('exception', onException);

    // begin connection
    ws.connect();

    // destroy listeners on unmount
    return () => {
      ws.disconnect();
      console.log('unsubscribing from events...');
      ws.off('connect', onConnection);
      ws.off('disconnect', onDisconnection);
      ws.off('message', onMessage);
      ws.off('message-confirmed', onMessageConfirmed);
      ws.off('exception', onException);
    }
  }, []);

  return (
    <authServiceContext.Provider value={{
      received: received,
      exceptions: exceptions,
      sent: sent,
      send,
      ws,
      connected
    }}>
      {children}
    </authServiceContext.Provider>
  )
}