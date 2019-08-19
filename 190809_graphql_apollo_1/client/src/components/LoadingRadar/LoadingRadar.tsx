import './LoadingRadar.scss';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: null,
};

type PT = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * Renders a blipping radar
 *
 * https://loading.io/css/
 * @param param0
 */
const LoadingRadar: React.FC<PT> = ({ className }) => (
  <div className={classNames('loading-radar', className)}>
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  </div>
);

LoadingRadar.propTypes = propTypes;
LoadingRadar.defaultProps = defaultProps;

export default LoadingRadar;
