import './LoadingRadarPage.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../../@types/infer-prop-types';
import LoadingRadar from '../../LoadingRadar/LoadingRadar';

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LoadingRadarPage
 *
 * @param props
 */
const LoadingRadarPage: React.FC<PropTypes> = (props) => {
  return (
    <div className="loading-radar-page">
      <LoadingRadar />
    </div>
  );
};

LoadingRadarPage.propTypes = propTypes;
LoadingRadarPage.defaultProps = defaultProps;

export default LoadingRadarPage;