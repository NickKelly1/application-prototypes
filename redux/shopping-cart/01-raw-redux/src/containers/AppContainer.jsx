import React from 'react';
import ProductsContainer from './ProductsContainer';
import CartContainer from './CartContainer';

const AppContainer = () => (
  <div>
    <h2>Shopping cart Example</h2>
    <hr />
    <ProductsContainer />
    <hr />
    <CartContainer />
  </div>
);

export default AppContainer;