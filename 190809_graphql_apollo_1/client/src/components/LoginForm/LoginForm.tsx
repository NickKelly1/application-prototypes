import './LoginForm.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import { $TS_FIX_ME } from '../../helpers/helper-types';

const propTypes = {
  login: PropTypes.func.isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LoginForm
 *
 * @param props
 */
const LoginForm: React.FC<PropTypes> = (
  { login }: { login: (args: { variables: { email: string } }) => $TS_FIX_ME<Promise<unknown>> }
) => {
  const [email, setEmail] = useState('');

  return (
    <div className="login-form">
      <div>Log in:</div>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          type="email"
          name="email"
          placeholder="Email"
          data-testid="login-input"
        />
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            login({ variables: { email } });
          }}
          type="submit"
        >Submit</button>
      </div>
    </div>
  );
};

LoginForm.propTypes = propTypes;
LoginForm.defaultProps = defaultProps;

export default LoginForm;