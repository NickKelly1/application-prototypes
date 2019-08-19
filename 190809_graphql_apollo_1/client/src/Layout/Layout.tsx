import './Layout.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../@types/infer-prop-types';
import TopBar from './TopBar/TopBar';

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * Layout
 *
 * @param props
 */
const Layout: React.FC<PropTypes> = ({ children }) => {
  return (
    <div className="layout">
      <div className="heading">
        <TopBar />
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;