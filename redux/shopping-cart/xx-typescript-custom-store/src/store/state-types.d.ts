import { TCartActionTypes } from "./cart-state/cart-actions";
import { ICartState } from "./cart-state/cart-types";
import { TShopActionTypes } from "./shop-state/shop-actions";
import { IShopState } from "./shop-state/shop-types";

export type TActionTypes = TShopActionTypes | TCartActionTypes;

export interface IState {
  shop: IShopState,
  cart: ICartState,
}
