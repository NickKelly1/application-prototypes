import React from 'react';
import PropTypes from 'prop-types';
import ProductComponent from './ProductComponent';

const ProductItemComponent = ({ product, onAddToCartClicked }) => (
  <div style={{ marginBottom: 20 }}>
    <ProductComponent
      title={product.title}
      price={product.price}
      quantity={product.inventory} />
    <button
      onClick={onAddToCartClicked}
      disabled={product.inventory > 0 ? '' : 'disabled'}>
      {product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
    </button>
  </div>
);

ProductItemComponent.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    inventory: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCartClicked: PropTypes.func.isRequired,
};

export default ProductItemComponent;
