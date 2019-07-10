import React, { FC } from 'react';
import ShopContainer from './ShopContainer';
import CartContainer from './CartContainer';
import { Provider } from 'react-redux';
import { store } from '../../store/application-store';
import { shopActions } from '../../store/shop-state/shop-actions';
import { cartActions } from '../../store/cart-state/cart-actions';
import { shopSelectors } from '../../store/shop-state/shop-selectors';
import { cartSelectors } from '../../store/cart-state/cart-selectors';

interface IAppProps {
  //
}

shopActions.receiveProducts()(store.dispatch, store.getState);


if (window instanceof Object) {
  // store
  if (!Object.prototype.hasOwnProperty.call(window, 'store')) ( window as any ).store = store;

  // shop
  if (!Object.prototype.hasOwnProperty.call(window, 'shopActions')) ( window as any ).shopActions = shopActions;
  if (!Object.prototype.hasOwnProperty.call(window, 'shopSelectors')) ( window as any ).shopSelectors = shopSelectors;
  // cart
  if (!Object.prototype.hasOwnProperty.call(window, 'cartActions')) ( window as any ).cartActions = cartActions;
  if (!Object.prototype.hasOwnProperty.call(window, 'cartSelectors')) ( window as any ).cartSelectors = cartSelectors;
}

// let store = window.store
// let shopActions = window.shopActions
// let cartActions = window.cartActions
// let shopSelectors = window.shopSelectors
// let cartSelectors = window.cartSelectors


const AppContainer: FC<IAppProps> = () => {
  console.log(' - RENDER [AppContainer]');
  return (
    <Provider store={store}>
      <div>
        <h2>Shopping Cart Example</h2>
        <hr />
        <ShopContainer />
        <hr />
        <CartContainer />
      </div>
    </Provider>
  );
}

export default AppContainer;
