import { IState } from "../state-types";
import { notUndefined } from "../../helpers/notUndefined";
import * as shopSelectors from '../shop-state/shop-selectors';
import { TGetStateFunction } from "../store-types";
import { ICartProduct } from "./cart-types";

/**
 * @description
 * Get the cart total
 */
export const getTotal = (getState: TGetStateFunction<IState>) => (): string => {
  const state = getState();
  return state
    .cart
    .addedProductIds
    .reduce((total, id) => {
      const product = shopSelectors.getProduct(getState)(id);
      if (product === undefined) return total;
      return total + product.price;
    }, 0).toFixed(2);
};


/**
 * @description
 * Get the quantity of a product in the cart
 */
export const getProductQuantity = (getState: TGetStateFunction<IState>) => (id: string): number => {
  const state = getState();
  return state
    .cart
    .quantityById[id] || 0;
};


/**
 * @description
 * Get all products in the cart
 */
export const getProducts = (getState: TGetStateFunction<IState>) => (): ICartProduct[] => {
  const state = getState();
  return state
    .cart
    .addedProductIds
    .map(id => shopSelectors.getProduct(getState)(id))
    .filter(notUndefined)
    // transform shopProduct to cartProduct
    .map(shopProduct => ({ ...shopProduct, quantity: getProductQuantity(getState)(shopProduct.id) }))
}
