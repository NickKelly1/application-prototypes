import './BookTrips.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import { logger } from '../../helpers/logger';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { GET_LAUNCH } from '../CartItem/CartItem';

const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

const propTypes = {
  // array of ids
  cartItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * BookTrips
 *
 * @param props
 */
const BookTrips: React.FC<PropTypes> = ({ cartItems }) => {
  const [bookTrips, { data, loading, error }] = useMutation(
    BOOK_TRIPS,
    {
      variables: { launchIds: cartItems },
      refetchQueries: cartItems.map(launchId => ({
        query: GET_LAUNCH,
        variables: { launchId },
      })),
      update(cache) {
        cache.writeData({ data: { cartItems: [] } });
      }
    }
  )

  logger('BookTrips::render', { message: { cartItems } });

  if (data && data.bookTrips && !data.bookTrips.success) return (
    <p data-testid="message">{data.bookTrips.message}</p>
  );

  return (
    <button onClick={(e) => bookTrips()} data-testid="book-button" >
      Book All
    </button>
  )
};

BookTrips.propTypes = propTypes;
BookTrips.defaultProps = defaultProps;

export default BookTrips;