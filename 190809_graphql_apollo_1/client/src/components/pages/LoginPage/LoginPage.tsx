import './LoginPage.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { InferPropTypes } from '../../../@types/infer-prop-types';
import LoadingRadar from '../../LoadingRadar/LoadingRadar';
import LoginForm from '../../LoginForm/LoginForm';

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LoginPage
 *
 * @param props
 */
const LoginPage: React.FC<PropTypes> = (props) => {
  const client = useApolloClient();
  const [login, { data, loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted({ login }) {
        localStorage.setItem('token', login);
        client.writeData({ data: { isLoggedIn: true } });
      }
    }
  );

  if (loading) return <LoadingRadar />;
  if (error) return <p>An error occurred</p>;

  return (
    <div className="login-page">
      <LoginForm login={login} />
    </div>
  );
};

LoginPage.propTypes = propTypes;
LoginPage.defaultProps = defaultProps;

export default LoginPage;