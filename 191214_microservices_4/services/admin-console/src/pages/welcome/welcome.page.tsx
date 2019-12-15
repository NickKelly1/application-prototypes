import React, { useContext } from 'react';
import logo from './logo.svg';
import './welcome.page.css';
import { authServiceContext } from '../../providers/auth-service/auth-service.provider';
import { MessageList } from '../../components/message-list/message-list.component';
import { AuthSrvClientMsgPing } from '../../shared/ts/auth-service/messages/client/auth-srv-client.msg.ping';
import { hDate } from '../../shared/ts/helpers/h-date.helper';

export const WelcomePage: React.FC = () => {
  const authSrv = useContext(authServiceContext);

  return (
    <div className="welcome">
      <header className="welcome-header">
        <img src={logo} className="welcome-logo" alt="logo" />
        <h1>Welcome</h1>
      </header>
      <div>Message list:</div>
      <div>
        <button
          style={{
            opacity: authSrv.connected ? 1.0 : 0.5,
            pointerEvents: authSrv.connected ? 'all' : 'none',
          }}
          onClick={() => {
            console.log('sending message...');
            const uuid = (Math.random() * 1000000).toFixed(0).toString();
            console.log('sending', uuid);
            authSrv.send(new AuthSrvClientMsgPing(uuid, uuid))
          }}
        ><label>Click me</label></button>
        <div>
          <div>
            <h2>Received messages</h2>
            <ol>{authSrv.received.map(msg => <li>{`[${hDate(msg.receivedAt, null)}] ${msg.val.type}`}</li>)}</ol>
          </div>
          <div>
            <h2>Exceptions</h2>
            <ol>{authSrv.exceptions.map(msg => <li>{`[${hDate(msg.receivedAt, null)}] ${JSON.stringify(msg.val)}`}</li>)}</ol>
          </div>
          <div>
            <h2>Sent messages</h2>
            <ol>{authSrv.sent.map(msg => <li>{`[${hDate(msg.sentAt, null)} (${!!msg.confirmedAt})] ${msg.val.type}`}</li>)}</ol>
          </div>
        </div>
      </div>
      <MessageList />
    </div>
  );
}

