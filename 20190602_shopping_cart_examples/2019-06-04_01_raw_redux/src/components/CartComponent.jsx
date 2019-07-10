import React from 'react';
import PropTypes from 'prop-types';
import ProductComponent from './ProductComponent';

const CartComponent = ({ products, total, onCheckoutClicked }) => {
  const hasProducts = products.length > 0;

  const nodes = hasProducts
    ? (
      products.map(product =>
        <ProductComponent
          title={product.title}
          price={product.price}
          quantity={product.quantity}
          key={product.id}
        />
      )
    ) : <em>Please add some products to the cart.</em>;

  return (
    <div>
      <h3>Your Cart</h3>
      <div>{nodes}</div>
      <p>Total: &#36;{total}</p>
      <button onClick={onCheckoutClicked}
        disabled={hasProducts ? '' : 'disabled'}>
        Checkout
      </button>
    </div>
  )
}

CartComponent.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  })),
  total: PropTypes.string,
  onCheckoutClicked: PropTypes.func,
};

export default CartComponent;
