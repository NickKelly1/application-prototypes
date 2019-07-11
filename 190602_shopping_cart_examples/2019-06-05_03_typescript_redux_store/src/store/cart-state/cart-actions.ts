import { TActionTypes, IState, GetState } from "../state-types";
import ShopAPI from "../../api/ShopAPI";
import { CART_ACTION_NAMES } from "./cart-action-types";
import { ICartProduct } from "./cart-types";
import { shopSelectors } from "../shop-state/shop-selectors";
import { Dispatch } from "redux";

export const cartActions = {
  /**
   * @description
   * add a product to the cart
   *
   * @param productId
   */
  addProducts: (productId: string) => (dispatch: Dispatch<TActionTypes>, getState: GetState<IState>) => {
    // validate the product exists
    const product = shopSelectors.getShopProduct(getState(), productId);

    // todo: error message
    if (product === undefined || product.inventory < 1) return;

    dispatch({
      type: CART_ACTION_NAMES.ADD_TO_CART,
      payload: { productId }
    });
  },


  /**
   * @description
   * Check out a set of products in the cart
   *
   * @param products
   */
  checkout: (products: ICartProduct[]) => async (dispatch: Dispatch<TActionTypes>, getState: GetState<IState>) => {
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
}
