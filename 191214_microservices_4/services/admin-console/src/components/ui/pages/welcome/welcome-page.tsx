import React, { useContext, useState } from 'react';
import { uuidv4 } from '@syntaxfanatics/peon';
import logo from './logo.svg';
import './welcome.page.css';
import { AuthSVCClientMsgPing } from '../../../../shared/ts/auth-service/messages/client/auth-svc-client.msg.ping';
import { hDate } from '../../../../shared/ts/helpers/h-date.helper';
import { AuthServiceContext } from '../../../services/auth-service/provider/auth-service-provider';
import { CreateUserForm } from '../../../services/auth-service/create-user-wizard/create-user-wizard';



export const WelcomePage: React.FC = () => {
  const authSVC = useContext(AuthServiceContext);
  return (
    <div className="welcome">
      <header className="welcome-header">
        <img src={logo} className="welcome-logo" alt="logo" />
        <h1>Welcome</h1>
      </header>
      <div>Message list:</div>
      <div>
        <button
          disabled={!authSVC.connected}
          style={{ opacity: authSVC.connected ? 1.0 : 0.5 }}
          onClick={() => {
            console.log('sending message...');
            const uuid = uuidv4();
            console.log('sending', uuid);
            authSVC.send(new AuthSVCClientMsgPing(uuid, uuid))
          }}
        ><label>Click me</label></button>
        <CreateUserForm />
        <div>
          <div>
            <h2>Received messages</h2>
            <ol>
              {authSVC.received.map(msg => (
                <li key={msg.val.uuid}>
                  {`[${hDate(msg.receivedAt, null)}] ${msg.val.type}`}
                </li>)
              )}
            </ol>
          </div>
          <div>
            <h2>Exceptions</h2>
            <ol>
              {authSVC.exceptions.map((msg, i) => (
                <li key={i}>
                  {`[${hDate(msg.receivedAt, null)}] ${JSON.stringify(msg.val)}`}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2>Sent messages</h2>
            <ol>
              {authSVC.sent.map(msg => (
                <li key={msg.val.uuid}>
                  {`[${hDate(msg.sentAt, null)} (${!!msg.confirmedAt})] ${msg.val.type}`}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

