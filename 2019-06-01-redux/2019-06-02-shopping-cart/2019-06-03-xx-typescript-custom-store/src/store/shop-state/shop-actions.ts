import { IShopProduct } from "./shop-types";

export const SHOP_ACTION_NAMES = {
  RECEIVE_PRODUCTS: "RECEIVE_PRODUCTS" as const,
}

export type TShopActionTypes =
  { type: typeof SHOP_ACTION_NAMES.RECEIVE_PRODUCTS, payload: { products: IShopProduct[] } }
