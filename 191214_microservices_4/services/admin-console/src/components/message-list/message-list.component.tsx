import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AUTH_SRV_CLIENT_MSGS } from '../../shared/ts/auth-service/messages/auth-srv-client.msg';
import { AUTH_SRV_SERVER_MSGS } from '../../shared/ts/auth-service/messages/auth-srv-server.msg';
import { authServiceContext } from '../../providers/auth-service/auth-service.provider';


export const MessageList: React.FC = () => {
  const authSrv = useContext(authServiceContext);

  return (
    <ul>
      {authSrv.receivedMessages.map(msg => <li key={msg.uuid}>msg.type</li>)}
    </ul>
  );
}

// MessageList.propTypes = {
//   sentMessages: PropTypes.arrayOf(AUTH_SRV_CLIENT_MSGS),
//   // receivedMessages: PropTypes.arrayOf(AUTH_)
// }