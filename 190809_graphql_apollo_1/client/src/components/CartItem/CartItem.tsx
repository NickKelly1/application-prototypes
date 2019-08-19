import './CartItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import gql from 'graphql-tag';
import { LAUNCH_TILE_DATA } from '../pages/LaunchesPage/LaunchesPage';
import { useQuery } from '@apollo/react-hooks';
import LoadingRadar from '../LoadingRadar/LoadingRadar';
import LaunchTile from '../LaunchTile/LaunchTile';

export const GET_LAUNCH = gql`
  query GetLaunch($launchId: ID!) {
    launch(id: $launchId) {
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const propTypes = {
  launchId: PropTypes.string.isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * CartItem
 *
 * @param props
 */
const CartItem: React.FC<PropTypes> = ({ launchId }) => {
  const { data, loading, error } = useQuery(
    GET_LAUNCH,
    { variables: { launchId } },
  );
  if (loading) return <LoadingRadar />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <div className='cart-item'>
      {data && <LaunchTile launch={data.launch} />}
    </div>
  );
};

CartItem.propTypes = propTypes;
CartItem.defaultProps = defaultProps;

export default CartItem;