import './TopBar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes';

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * TopBar
 *
 * @param props
 */
const TopBar: React.FC<PropTypes> = (props) => {
  return (
    <div className="top-bar">
      <div className="left">
        <div className="links">
          <Link to={ROUTES.HOME_PAGE.get()}>Welcome</Link>
          <Link to={ROUTES.PROFILE_PAGE.get()}>Profile</Link>
        </div>
      </div>
      <div className="right"><LogoutButton /></div>
    </div>
  );
};

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;