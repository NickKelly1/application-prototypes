import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AuthServiceContext } from '../provider/auth-service-provider';


export const MessageList: React.FC = () => {
  const { received, sent, exceptions } = useContext(AuthServiceContext);

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