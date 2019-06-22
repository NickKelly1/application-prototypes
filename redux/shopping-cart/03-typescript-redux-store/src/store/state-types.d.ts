import { TCartActionTypes } from "./cart-state/cart-action-types";
import { ICartState } from "./cart-state/cart-types";
import { TShopActionTypes } from "./shop-state/shop-action-types";
import { IShopState } from "./shop-state/shop-types";

export type GetState<UState> = () => UState;

export type TActionTypes = TShopActionTypes | TCartActionTypes;

export interface IState {
  entities: {
    cart: ICartState,
    shop: IShopState,
  },
  ui: {
    //
  },
}
