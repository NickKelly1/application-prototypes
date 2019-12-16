import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { authServiceContext } from '../../providers/auth-service/auth-service.provider';


export const MessageList: React.FC = () => {
  const { received, sent, exceptions } = useContext(authServiceContext);

  console.log({ received, sent, exceptions });

  return (
    <ul>
      {received.map(msg => <li key={msg.val.uuid}>{msg.val.type}</li>)}
    </ul>
  );
}

// MessageList.propTypes = {
//   sentMessages: PropTypes.arrayOf(AUTH_SVC_CLIENT_MSGS),
//   // receivedMessages: PropTypes.arrayOf(AUTH_)
// }