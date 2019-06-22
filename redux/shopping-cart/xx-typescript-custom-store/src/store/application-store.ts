import { IState, TActionTypes } from "./state-types";
import { shopReducer } from "./shop-state/shop-reducer";
import { cartReducer } from "./cart-state/cart-reducer";
import { createStore } from "./create-store";
import * as cartCommands from "./cart-state/cart-commands";
import * as cartSelectors from "./cart-state/cart-selectors";
import * as shopCommands from "./shop-state/shop-commands";
import * as shopSelectors from "./shop-state/shop-selectors";


export const createApplicationStore = (
  initialState: IState = {
    shop: { productsById: {}, productIds: [] },
    cart: { addedProductIds: [], quantityById: {} },
  }
) => {
  const reducers = [
    (state: IState, action: TActionTypes) => ({ ...state, cart: cartReducer(state.cart, action) }),
    (state: IState, action: TActionTypes) => ({ ...state, shop: shopReducer(state.shop, action) }),
  ];

  const store = createStore(initialState, reducers);

  const cart = {
    commands: {
      addProducts:          cartCommands.addProducts(store.getState, store.dispatch),
      checkout:             cartCommands.checkout(store.getState, store.dispatch),
    },
    selectors: {
      getTotal:             cartSelectors.getTotal(store.getState),
      getProductQuantity:   cartSelectors.getProductQuantity(store.getState),
      getProducts:          cartSelectors.getProducts(store.getState),
    },
  }

  const shop = {
    commands: {
      receiveProducts:      shopCommands.receiveProducts(store.getState, store.dispatch),
    },
    selectors: {
      getProduct:           shopSelectors.getProduct(store.getState),
      getProducts:          shopSelectors.getProducts(store.getState),
    },
  }

  return {
    cart,
    shop,

    // expose the store for debugging
    store,
  };
}