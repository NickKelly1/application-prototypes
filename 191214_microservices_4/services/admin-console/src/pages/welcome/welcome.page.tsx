import React, { useContext } from 'react';
import logo from './logo.svg';
import './welcome.page.css';
import { authServiceContext } from '../../providers/auth-service/auth-service.provider';
import { MessageList } from '../../components/message-list/message-list.component';
import { AuthSrvClientMsgPing } from '../../shared/ts/auth-service/messages/client/auth-srv-client.msg.ping';

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
        <button onClick={() => {
          const uuid = (Math.random() * 1000000).toFixed(0).toString();
          console.log('sending', uuid);
          authSrv.sendMessage(new AuthSrvClientMsgPing(uuid, uuid))
        }}>Click me</button>
      </div>
      <MessageList />
    </div>
  );
}

