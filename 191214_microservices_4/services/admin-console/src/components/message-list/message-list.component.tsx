import React, { useContext } from 'react';
import PropTypes from 'prop-types';

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