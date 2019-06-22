import { TActionTypes, IState } from "../state-types";
import ShopAPI from "../../api/ShopAPI";
import { TGetStateFunction, TDispatchFunction } from "../store-types";
import { CART_ACTION_NAMES } from "./cart-actions";
import { ICartProduct } from "./cart-types";


/**
 * @description
 * add a product to the cart
 *
 * @param productId
 */
export const addProducts = (getState: TGetStateFunction<IState>, dispatch: TDispatchFunction<TActionTypes>) => (productId: string) => {
  const product = getState().shop.productsById[productId];
  if (product === undefined || product.inventory) return;

  dispatch({
    type: CART_ACTION_NAMES.ADD_TO_CART,
    payload: { productId }
  });
}


/**
 * @description
 * Check out a set of products in the cart
 *
 * @param products
 */
export const checkout = (getState: TGetStateFunction<IState>, dispatch: TDispatchFunction<TActionTypes>) => async (products: ICartProduct[]) => {
  // TODO: check out the cart, or products?
  // const { cart } = getState();

  dispatch({ type: CART_ACTION_NAMES.CHECKOUT_REQUEST, });
  try {
    await ShopAPI.buyProducts(products);
    dispatch({ type: CART_ACTION_NAMES.CHECKOUT_SUCCESS });
  } catch (error) {
    // TODO: rollback on failure
  }
}
