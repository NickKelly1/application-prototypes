import { TActionTypes, IState } from "../state-types";
import { SHOP_ACTION_NAMES } from "./shop-actions";
import ShopAPI from "../../api/ShopAPI";
import { TGetStateFunction, TDispatchFunction } from "../store-types";

/**
 * @description
 * Receive products into the shop
 */
export const receiveProducts = (getState: TGetStateFunction<IState>, dispatch: TDispatchFunction<TActionTypes>) => async () => {
  const products = await ShopAPI.fetchProducts();

  dispatch({
    type: SHOP_ACTION_NAMES.RECEIVE_PRODUCTS,
    payload: { products }
  });
}
