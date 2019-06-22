import { TActionTypes, IState, GetState } from "../state-types";
import { SHOP_ACTION_NAMES } from "./shop-action-types";
import ShopAPI from "../../api/ShopAPI";
import { Dispatch } from "redux";

export const shopActions = {
  /**
   * @description
   * Receive products into the shop
   */
  receiveProducts: () => async (dispatch: Dispatch<TActionTypes>, getState: GetState<IState>) => {
    const products = await ShopAPI.fetchProducts();

    dispatch({
      type: SHOP_ACTION_NAMES.RECEIVE_PRODUCTS,
      payload: { products }
    });
  }
}
