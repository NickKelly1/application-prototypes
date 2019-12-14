import React, { useContext } from 'react';
import logo from './logo.svg';
import './welcome.page.css';
import { authServiceContext } from '../../providers/auth-service/auth-service.provider';
import { MessageList } from '../../components/message-list/message-list.component';
import { AuthSrvClientMsgPing } from '../../shared/ts/auth-service/messages/client/auth-srv-client.msg.ping';

export const WelcomePage: React.FC = () => {
  const { send: sendMessage, connected } = useContext(authServiceContext);

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
            opacity: connected ? 1.0 : 0.5,
            pointerEvents: connected ? 'all' : 'none',
          }}
          onClick={() => {
            console.log('sending message...');
            const uuid = (Math.random() * 1000000).toFixed(0).toString();
            console.log('sending', uuid);
            sendMessage(new AuthSrvClientMsgPing(uuid, uuid))
          }}
        ><label>Click me</label></button>
      </div>
      <MessageList />
    </div>
  );
}

