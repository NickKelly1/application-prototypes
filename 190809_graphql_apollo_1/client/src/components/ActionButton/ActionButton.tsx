import './ActionButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { GET_LAUNCH_DETAILS } from '../pages/LaunchPage/LaunchPage';
import { logger } from '../../helpers/logger';

export const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`;

export const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`

const propTypes = {
  isBooked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  isInCart: PropTypes.bool.isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * ActionButton
 *
 * @param props
 */
const ActionButton: React.FC<PropTypes> = ({ isBooked, isInCart, id }) => {
  const [mutate, { loading, error }] = useMutation(
    isBooked ? CANCEL_TRIP : TOGGLE_CART,
    {
      variables: { launchId: id },
      refetchQueries: [
        {
          query: GET_LAUNCH_DETAILS,
          variables: { launchId: id },
        }
      ]
    }
  );

  logger('ActionButton::render');

  return (
    <div className="action-button">
      <button
        onClick={() => {
          logger('ActionButton::onClick __ mutate');
          mutate();
        }}
        // isBooked={isBooked}
        data-testid='action-button'
      >
        {isBooked
          ? 'Cancel this trip'
          : isInCart
            ? 'Remove from Cart'
            : 'Add to Cart'
        }
      </button>
    </div>
  )
};

ActionButton.propTypes = propTypes;
ActionButton.defaultProps = defaultProps;

export default ActionButton;