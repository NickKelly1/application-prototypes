import React from 'react';
import PropTypes from 'prop-types';

const ProductListComponent = ({ title, children }) => (
  <div>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
);

ProductListComponent.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

export default ProductListComponent;
