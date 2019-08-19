import './LaunchTile.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { InferPropTypes } from '../../@types/infer-prop-types';
import { ROUTES } from '../../app/routes';

const propTypes = {
  launch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    mission: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    rocket: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LaunchTile
 *
 * @param props
 */
const LaunchTile: React.FC<PropTypes> = (props) => {
  const { launch } = props;
  const { id, mission, rocket } = launch;

  return (
    <div className="launch-tile">
      <Link to={ROUTES.LAUNCH_PAGE.get(id)}>{`Launch: ${launch.id}`}</Link>
      <h3>{`Mission name: ${mission.name}`}</h3>
      <h5>{`Rocket name: ${rocket.name}`}</h5>
    </div>
  )
};

LaunchTile.propTypes = propTypes;
LaunchTile.defaultProps = defaultProps;

export default LaunchTile;