import './LaunchPage.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { InferPropTypes } from '../../../@types/infer-prop-types';
import LaunchDetail from '../../LaunchDetail/LaunchDetail';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import Header from '../../Header/Header';
import { routerPropTypes, historyPropTypes, locationPropTypes, matchPropTypes } from '../../../prop-types/router-prop-types';
import ActionButton from '../../ActionButton/ActionButton';
import { Link } from 'react-router-dom';
import { LAUNCH_TILE_DATA } from '../LaunchesPage/LaunchesPage';
import LoadingSpinnerPage from '../LoadingSpinnerPage/LoadingSpinnerPage';
import LoadingRadarPage from '../LoadingRadarPage/LoadingRadarPage';


const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      id
      site
      isBooked
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;


const propTypes = {
  history: PropTypes.shape(historyPropTypes).isRequired,
  location: PropTypes.shape(locationPropTypes).isRequired,
  match: PropTypes.shape(matchPropTypes).isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * LaunchPage
 *
 * @param props
 */
const LaunchPage: React.FC<PropTypes> = ({ match }) => {
  const { launchId } = match.params;

  if (!launchId) throw new TypeError('No launchId on match params');

  const { data, loading, error } = useQuery(
    GET_LAUNCH_DETAILS,
    { variables: { launchId } },
  );


  if (loading) return <LoadingRadarPage />;
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="launch-page">
      <Header image={data.launch.mission.missionPatch} >
        {data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <Link to={'/'}>Home</Link>
      <ActionButton {...data.launch} />
    </div>
  )
};

LaunchPage.propTypes = propTypes;
LaunchPage.defaultProps = defaultProps;

export default LaunchPage;