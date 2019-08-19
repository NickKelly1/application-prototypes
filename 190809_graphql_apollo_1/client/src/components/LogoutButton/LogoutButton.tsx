import './LogoutButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import { useApolloClient } from '@apollo/react-hooks';

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LogoutButton
 *
 * @param props
 */
const LogoutButton: React.FC<PropTypes> = (props) => {
  const client = useApolloClient();

  return (
    <div className="logout-button">
      <button
        onClick={() => {
          client.writeData({ data: { isLoggedIn: false } });
          localStorage.clear();
        }}
      >Logout</button>
    </div>
  );
};

LogoutButton.propTypes = propTypes;
LogoutButton.defaultProps = defaultProps;

export default LogoutButton;