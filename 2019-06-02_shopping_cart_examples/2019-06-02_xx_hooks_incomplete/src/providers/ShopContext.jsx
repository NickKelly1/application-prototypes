import React, { createContext, useReducer } from 'react';
import reducer from '../helpers/reducer';



const initialState = {
  // addedProductIds: [],
  // productQuantityById: {},
  productIds: [],
  productsById: {},
};

export const ShopContext = createContext(initialState);

export const SHOP_ACTIONS = {
  FETCH_PRODUCTS: 'FETCH_PRODUCTS',
};

const shopActionHandlers = {
  [SHOP_ACTIONS.FETCH_PRODUCTS]: (state, action) => ({
    ...state,
    productsById: action.payload.products.reduce((obj, product) => {
      console.log(obj, product);
      obj[product.id] = product;
      return obj;
    }, {}),
    productIds: action.payload.products.map(product => product.id),
  }),
};

const shopReducer = reducer(shopActionHandlers);

export function ShopContextProvider({ children }) {
  const [ shopState, dispatchToShop ] = useReducer(shopReducer, initialState);



  return (
    <ShopContext.Provider value={{ shopState, dispatchToShop }}>
      {children}
    </ShopContext.Provider>
  );
};
