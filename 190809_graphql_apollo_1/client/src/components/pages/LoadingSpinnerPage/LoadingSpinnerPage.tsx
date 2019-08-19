import './LoadingSpinnerPage.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../../@types/infer-prop-types';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LoadingSpinnerPage
 *
 * @param props
 */
const LoadingSpinnerPage: React.FC<PropTypes> = (props) => {
  return (
    <div className="loading-spinner-page">
      <LoadingSpinner />
    </div>
  );
};

LoadingSpinnerPage.propTypes = propTypes;
LoadingSpinnerPage.defaultProps = defaultProps;

export default LoadingSpinnerPage;