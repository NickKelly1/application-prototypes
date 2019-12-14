import React, { createContext, useState, useEffect } from 'react';
import io, { connect } from 'socket.io-client';
import { env } from '../../env';
import { IAuthSrvMsg } from '../../shared/ts/auth-service/messages/auth-srv.msg.interface';
import { AN_AUTH_SRV_CLIENT_MSG } from '../../shared/ts/auth-service/messages/auth-srv-client.msg';
import { AN_AUTH_SRV_SERVER_MSG } from '../../shared/ts/auth-service/messages/auth-srv-server.msg';

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
    sendMessage: function sendMessage(this: AuthServiceContext, msg: AN_AUTH_SRV_CLIENT_MSG) {
      if (this.ws) {
        console.log('Sending', msg)
        this.ws.emit('message', msg);
      } else {
        console.log('Unable to send', msg)
      }
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
    const ws = io(`${env.AUTH_SRV_HOST}:${env.AUTH_SRV_WEB_SOCKET_PORT}`);


    function onMessageReceived(msg: AN_AUTH_SRV_SERVER_MSG) {
      console.log('message received', msg);
      setContextValue((prev) => ({
        ...prev,
        receivedMessages: prev.receivedMessages.concat([msg]),
      }));
    };

    function onMessageConfirmed(uuid: IAuthSrvMsg['uuid']) {
      console.log('message confirmed', uuid);
      setContextValue((prev) => ({
        ...prev,
        sentMessages: prev.sentMessages.map(sent => sent.msg.uuid === uuid
          ? ({ confirmed: true, msg: sent.msg })
          : sent)
      }));
    };

    function onConnect() {
      console.log('Connected to Auth Service');
      ws.on('message', onMessageReceived);
      ws.on('message-confirmed', onMessageConfirmed);
      setContextValue(({ status, ...other }) => ({
        ...other,
        ws: ws,
        status: AUTH_SERVICE_CONTEXT_STATE.CONNECTED,
      }));
    };

    function onDisconnect() {
      console.log('Disconnected from Auth Service');
      ws.off('message', onMessageReceived);
      ws.off('message-confirmed', onMessageConfirmed);
      setContextValue(({ status, ...other }) => ({
        ...other,
        ws: ws,
        status: AUTH_SERVICE_CONTEXT_STATE.DISCONNECTED,
      }));
    };

    ws.on('connect', onConnect);
    ws.on('disconnect', onDisconnect);

    // destroy listeners on unmount
    return () => {
      console.log('unsubscribing from events...');
      ws.off('connect', onConnect);
      ws.off('disconnect', onDisconnect);
      ws.off('message', onMessageReceived);
      ws.off('message-confirmed', onMessageConfirmed);
    }
  }, []);


  if (!contextValue) return <div>Initialising...</div>;

  if (contextValue.status === AUTH_SERVICE_CONTEXT_STATE.UNINITIALISED) return <div>Uninitialised...</div>
  if (contextValue.status === AUTH_SERVICE_CONTEXT_STATE.DISCONNECTED) return <div>Disconnected...</div>

  return (
    <authServiceContext.Provider value={contextValue}>
      {children}
    </authServiceContext.Provider>
  )
}