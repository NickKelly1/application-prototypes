import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { env } from '../../env';
import { AN_AUTH_SRV_CLIENT_MSG } from '../../shared/ts/auth-service/messages/auth-srv-client.msg';
import { AN_AUTH_SRV_SERVER_MSG } from '../../shared/ts/auth-service/messages/auth-srv-server.msg';
import { IAuthSrvMsg } from '../../shared/ts/auth-service/messages/auth-srv.msg.interface';

export const AUTH_SERVICE_CONTEXT_STATE = {
  UNINITIALISED: 'uninitialised',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
} as const;
export type AUTH_SERVICE_CONTEXT_STATE = typeof AUTH_SERVICE_CONTEXT_STATE;
export type AN_AUTH_SERVICE_CONTEXT_STATE = AUTH_SERVICE_CONTEXT_STATE[keyof AUTH_SERVICE_CONTEXT_STATE];

type PersistentAuthServiceContext = {
  sentMessages: { confirmed: boolean, msg: AN_AUTH_SRV_CLIENT_MSG }[],
  receivedMessages: AN_AUTH_SRV_SERVER_MSG[],
  sendMessage: (msg: AN_AUTH_SRV_CLIENT_MSG) => any,
};

type AuthSerivceContextUninitialised = PersistentAuthServiceContext & {
  status: AUTH_SERVICE_CONTEXT_STATE['UNINITIALISED'],
  ws: null;
}

type AuthServiceContextConnected = PersistentAuthServiceContext & {
  status: AUTH_SERVICE_CONTEXT_STATE['CONNECTED'],
  ws: SocketIOClient.Socket;
}

type AuthServiceContextDisconnected = PersistentAuthServiceContext & {
  status: AUTH_SERVICE_CONTEXT_STATE['DISCONNECTED'],
  ws: SocketIOClient.Socket;
}

type AuthServiceContext =
  AuthSerivceContextUninitialised
  | AuthServiceContextConnected
  | AuthServiceContextDisconnected;

export const authServiceContext = createContext<AuthServiceContext>(null as any);

/**
 * @description
 * Provides network access to the auth service
 * 
 * @param param0 
 */
export const AuthServiceProvider: React.FC = ({ children }) => {
  const [contextValue, setContextValue] = useState<AuthServiceContext>(() => ({
    sendMessage: function sendMessage(msg: AN_AUTH_SRV_CLIENT_MSG) {
      setContextValue((prev) => ({
        ...prev,
        sentMessages: prev.sentMessages.concat([{ confirmed: false, msg }]),
      }));
    },
    sentMessages: [],
    receivedMessages: [],
    status: AUTH_SERVICE_CONTEXT_STATE.UNINITIALISED,
    ws: null,
  })); 


  /**
   * Connect listeners on boot
   */
  useEffect(() => {
    const connection = io({ host: env.AUTH_SRV_HOST, port: env.AUTH_SRV_PORT });

    function onMessageReceived(msg: AN_AUTH_SRV_SERVER_MSG) {
      setContextValue((prev) => ({
        ...prev,
        receivedMessages: prev.receivedMessages.concat([msg]),
      }));
    };

    function onMessageConfirmed(uuid: IAuthSrvMsg['uuid']) {
      setContextValue((prev) => ({
        ...prev,
        sentMessages: prev.sentMessages.map(sent => sent.msg.uuid === uuid
          ? ({ confirmed: true, msg: sent.msg })
          : sent)
      }));
    };

    function onConnect() {
      console.log('Connected to Auth Service');
      setContextValue(({ status, ...other }) => ({
        ...other,
        ws: connection,
        status: AUTH_SERVICE_CONTEXT_STATE.CONNECTED,
      }));
    };

    function onDisconnect() {
      console.log('Disconnected from Auth Service');
      setContextValue(({ status, ...other }) => ({
        ...other,
        ws: connection,
        status: AUTH_SERVICE_CONTEXT_STATE.DISCONNECTED,
      }));
    };

    connection.on('connect', onConnect);
    connection.on('disconnect', onDisconnect);
    connection.on('message', onMessageReceived);
    connection.on('message-confirmed', onMessageConfirmed);

    // destroy listeners on unmount
    return () => {
      connection.off('connect', onConnect);
      connection.off('disconnect', onDisconnect);
      connection.off('message', onMessageReceived);
      connection.off('message-confirmed', onMessageConfirmed);
    }
  }, []);


  if (!contextValue) return <div>Lost connection to Auth Service...</div>;

  return (
    <authServiceContext.Provider value={contextValue}>
      {children}
    </authServiceContext.Provider>
  )
}