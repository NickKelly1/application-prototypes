import './ProfilePage.scss';
import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { InferPropTypes } from '../../../@types/infer-prop-types';
import { LAUNCH_TILE_DATA } from '../LaunchesPage/LaunchesPage';
import LoadingRadar from '../../LoadingRadar/LoadingRadar';
import Header from '../../Header/Header';
import LaunchTile from '../../LaunchTile/LaunchTile';

const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * ProfilePage
 *
 * @param props
 */
const ProfilePage: React.FC<PropTypes> = (props) => {
  const { data, loading, error } = useQuery(
    GET_MY_TRIPS,
    { fetchPolicy: 'network-only' }
  );

  if (loading) return <LoadingRadar />
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <div className="profile-page">
      <Header>My Trips</Header>
      {data.me && data.me.trips.length
        ? (
          data.me.trips.map((launch: any) => (
            <LaunchTile key={launch.id} launch={launch} />
          ))
        ) : (
          <p>You haven&apos;t booked any trips</p>
        )}
    </div>
  );
};

ProfilePage.propTypes = propTypes;
ProfilePage.defaultProps = defaultProps;

export default ProfilePage;