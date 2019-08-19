import './LaunchDetail.scss';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import getBackgroundImage from '../../helpers/get-background-image';

const propTypes = {
  id: PropTypes.string.isRequired,
  site: PropTypes.string.isRequired,
  rocket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LaunchDetail
 *
 * @param props
 */
const LaunchDetail: React.FC<PropTypes> = ({ id, rocket, site }) => {

  const handleClickImage = useCallback((e: React.MouseEvent<HTMLImageElement, MouseEvent>) => console.log(id), [id]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLImageElement>) => void (e.keyCode === 13 && console.log('enter')), []);

  return (
    <div className="launch-detail">
      <div
        className="info-wrapper"
        style={{ backgroundImage: getBackgroundImage(id) }}
      >
        <h3>{`${rocket.name} ${rocket.type}`}</h3>
        <h5>{site}</h5>
      </div>
    </div>
  )
};

LaunchDetail.propTypes = propTypes;
LaunchDetail.defaultProps = defaultProps;

export default LaunchDetail;