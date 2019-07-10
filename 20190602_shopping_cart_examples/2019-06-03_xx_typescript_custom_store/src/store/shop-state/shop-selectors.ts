import { IState } from "../state-types";
import { TGetStateFunction } from "../store-types";
import { IShopProduct } from "./shop-types";
import { notUndefined } from "../../helpers/notUndefined";

/**
 * @description
 * Get a product from the shop
 */
export const getProduct = (getState: TGetStateFunction<IState>) => (id: string): IShopProduct | undefined => {
  return getState()
    .shop
    .productsById[id];
}

/**
 * @description
 * Get all products from the shop
 *
 * @param getState
 */
export const getProducts = (getState: TGetStateFunction<IState>) => (): IShopProduct[] => {
  return getState()
    .shop
    .productIds
    .map(id => getProduct(getState)(id))
    .filter(notUndefined);
}
