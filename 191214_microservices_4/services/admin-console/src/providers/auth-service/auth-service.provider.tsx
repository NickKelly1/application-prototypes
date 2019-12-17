import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { env } from '../../env';
import { IAuthSVCMsg } from '../../shared/ts/auth-service/messages/auth-svc.msg.interface';
import { AN_AUTH_SVC_CLIENT_MSG } from '../../shared/ts/auth-service/messages/auth-svc-client.msg';
import { AN_AUTH_SVC_SERVER_MSG } from '../../shared/ts/auth-service/messages/auth-svc-server.msg';
import { logger } from '../../shared/ts/helpers/logger';
import { AuthSVCException } from '../../shared/ts/auth-service/messages/@types/auth-svc-socket.io-client.socket';
import { SVC_MSG } from '../../shared/ts/constants/svc-msg.constant';



type AuthServiceContext = {
  send: (msg: AN_AUTH_SVC_CLIENT_MSG) => any,
  sent: { sentAt: Date, confirmedAt: null | Date; val: AN_AUTH_SVC_CLIENT_MSG }[],
  exceptions: { receivedAt: Date, val: unknown}[],
  received: { receivedAt: Date, val: AN_AUTH_SVC_SERVER_MSG}[],
  connected: boolean,
  ws: SocketIOClient.Socket;
};

export const authServiceContext = createContext<AuthServiceContext>(null as any);

const ws = io(`${env.AUTH_SVC_HOST}:${env.AUTH_SVC_WEB_SOCKET_PORT}`, { autoConnect: false });
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


  function send(msg: AN_AUTH_SVC_CLIENT_MSG) {
    cLog('[send]', msg);
    if (connected) {
      ws.emit(SVC_MSG.AUTH_CLIENT, msg);
      setSent((prev) => prev.concat([{ sentAt: new Date(), confirmedAt: null, val: msg }]));
    } else {
      cLog('[send]', 'Unable to send message: not connected', msg)
    }
  }


  /**
   * Connect listeners on boot
   */
  useEffect(() => {
    // bindings
    function onConnection() {
      cLog('[onConnect]');
      setConnected(true);
    };

    function onDisconnection() {
      cLog('[onDisconnect]');
      setConnected(false);
    };

    function onException(err: AuthSVCException) {
      cLog('[onException]', err);
      setExceptions(prev => prev.concat([{ receivedAt: new Date(), val: err }]));
    }

    // listener
    function onMessage(msg: AN_AUTH_SVC_SERVER_MSG) {
      cLog('[onMessage]', msg);
      setReceived((prev) => prev.concat([{ receivedAt: new Date(), val: msg }]));
    };

    function onMessageConfirmed(uuid: IAuthSVCMsg['uuid']) {
      cLog('[onMessageConfirmed]', uuid);
      setSent((prev) => prev.map(msg => msg.val.uuid === uuid ? ({ ...msg, confirmedAt: new Date() }) : msg));
    };

    ws.on('connect', onConnection);
    ws.on('disconnect', onDisconnection);
    ws.on(SVC_MSG.EXCEPTION, onException);
    ws.on(SVC_MSG.AUTH_SERVER, onMessage);
    ws.on(SVC_MSG.CONFIRMED, onMessageConfirmed);

    // begin connection
    ws.connect();

    // destroy listeners on unmount
    return () => {
      ws.disconnect();
      console.log('unsubscribing from events...');
      ws.off('connect', onConnection);
      ws.off('disconnect', onDisconnection);
      ws.off(SVC_MSG.AUTH_SERVER, onMessage);
      ws.off(SVC_MSG.CONFIRMED, onMessageConfirmed);
      ws.off(SVC_MSG.EXCEPTION, onException);
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