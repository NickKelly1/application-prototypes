import './CartPage.scss';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../../@types/infer-prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import LoadingRadar from '../../LoadingRadar/LoadingRadar';
import Header from '../../Header/Header';
import CartItem from '../../CartItem/CartItem';
import { $TS_FIX_ME } from '../../../helpers/helper-types';
import BookTrips from '../../BookTrips/BookTrips';

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
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
 * CartPage
 *
 * @param props
 */
const CartPage: React.FC<PropTypes> = (props) => {
  const { data, loading, error } = useQuery(GET_CART_ITEMS);

  if (loading) return <LoadingRadar />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <div className="cart-page">
      <Header>My Cart</Header>
      {!data.cartItems || !data.cartItems.length
        ? <p data-testid="empty-message">No items in your cart</p>
        : <Fragment>
          {data.cartItems.map((launchId: $TS_FIX_ME<any>) => (
            <CartItem key={launchId} launchId={launchId} />
          ))}
          <BookTrips cartItems={data.cartItems} />
        </Fragment>
      }
    </div>
  );
};

CartPage.propTypes = propTypes;
CartPage.defaultProps = defaultProps;

export default CartPage;