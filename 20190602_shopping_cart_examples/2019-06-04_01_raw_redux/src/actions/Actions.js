import ShopAPI from '../api/ShopAPI';
import * as ActionTypes from '../constants/ActionTypes';

const receiveProducts = products => ({
  type: ActionTypes.RECEIVE_PRODUCTS,
  products,
});

export const getAllProducts = () => async dispatch => {
  const products = await ShopAPI.getProducts();
  dispatch(receiveProducts(products));
}

const unsafeAddToCartAction = productId => ({
  type: ActionTypes.ADD_TO_CART,
  productId,
});

export const addToCartAction = productId => (dispatch, getState) => {
  if (getState().ProductStore.byId[productId].inventory > 0)
    dispatch(unsafeAddToCartAction(productId));
}

export const checkoutAction = products => async (dispatch, getState) => {
  const { CartStore } = getState();

  dispatch({ type: ActionTypes.CHECKOUT_REQUEST });

  await ShopAPI.buyProducts(products);

  dispatch({ type: ActionTypes.CHECKOUT_SUCCESS, CartStore });

  // Replace the line above with below to rollback on failure:
  // dispatch({ type: types.CHECKOUT_FAILURE, cart });
}