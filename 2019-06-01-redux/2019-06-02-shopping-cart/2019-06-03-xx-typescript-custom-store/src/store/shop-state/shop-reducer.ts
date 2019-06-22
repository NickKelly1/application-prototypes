import { TActionTypes } from "../state-types";
import { CART_ACTION_NAMES } from "../cart-state/cart-actions";
import { IShopProduct, IShopState } from "./shop-types";
import { SHOP_ACTION_NAMES } from "./shop-actions";

export const shopReducer = (
  state: IShopState,
  action: TActionTypes,
): IShopState => {
  switch (action.type) {
    case SHOP_ACTION_NAMES.RECEIVE_PRODUCTS:
      return {
        ...state,
        // product ids
        productIds: action.payload.products.map(product => product.id),
        // products by id
        ...action.payload.products.reduce((obj: {[id: string]: IShopProduct}, product: IShopProduct) => {
          obj[product.id] = product;
          return obj;
        }, {}),
      };

    case CART_ACTION_NAMES.ADD_TO_CART:
      const { productId } = action.payload;

      const product = state.productsById[productId];
      if (product === undefined) return state;

      return {
        ...state,
        // products by id
        productsById: {
          ...state.productsById,
          // product
          [productId]: {
            ...product,
            inventory: product.inventory - 1,
          },
        }
      }
    default: return state;
  }
}
