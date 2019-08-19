import './LoadingSpinner.scss';
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
 * Renders a loading spinner
 *
 * https://loading.io/css/
 * @param param0
 */
const LoadingSpinner: React.FC<PT> = ({ className }) => (
  <div className={classNames('loading-spinner', className)}>
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

LoadingSpinner.propTypes = propTypes;
LoadingSpinner.defaultProps = defaultProps;

export default LoadingSpinner;
