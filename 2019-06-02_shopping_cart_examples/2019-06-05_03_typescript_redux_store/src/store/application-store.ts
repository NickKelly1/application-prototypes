import { IState, TActionTypes } from "./state-types";
import thunk from 'redux-thunk';
import { shopReducer } from "./shop-state/shop-reducer";
import { cartReducer } from "./cart-state/cart-reducer";
import { createStore, Reducer, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from "redux-logger";

// https://medium.com/swinginc/react-redux-typescript-into-the-better-frontend-tutorial-d32f46e97995

const initialState: IState = {
  entities: {
    cart: { addedProductIds: [], quantityById: {} },
    shop: { productsById: {}, },
  },
  ui: {
    //
  },
}

const masterReducer: Reducer<IState, TActionTypes> = (state = initialState, action) => ({
  entities: {
    cart: cartReducer(state.entities.cart, action),
    shop: shopReducer(state.entities.shop, action),
  },
  ui: {
    //
  }
});


export const store = createStore(
  masterReducer,
  composeWithDevTools(applyMiddleware(
    thunk,
    logger,
  )),
);
