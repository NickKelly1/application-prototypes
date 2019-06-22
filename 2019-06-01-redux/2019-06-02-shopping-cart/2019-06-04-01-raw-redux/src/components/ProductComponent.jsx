import React from 'react';
import PropTypes from 'prop-types';

const ProductComponent = ({ price, quantity, title }) => (
  <div>
    {title} - &#36;{price}{quantity ? ` x ${quantity}` : null}
  </div>
);

ProductComponent.propTypes = {
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number,
  title: PropTypes.string.isRequired,
};

export default ProductComponent;

