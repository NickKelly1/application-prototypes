import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkoutAction } from '../actions/Actions';
import { getTotal, getCartProducts } from '../reducers/Reducers';
import CartComponent from '../components/CartComponent';

const CartContainer = ({ products, total, checkoutAction }) => (
  <CartComponent
    products={products}
    total={total}
    onCheckoutClicked={() => checkoutAction(products)}
  />
);

CartContainer.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
  })).isRequired,
  total: PropTypes.string,
  checkoutAction: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  products: getCartProducts(state),
  total: getTotal(state)
});

export default connect(
  mapStateToProps,
  { checkoutAction }
)(CartContainer);
