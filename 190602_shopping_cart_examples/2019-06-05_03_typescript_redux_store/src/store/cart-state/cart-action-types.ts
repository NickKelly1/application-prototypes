import { ICartProduct } from "./cart-types";

export const CART_ACTION_NAMES = {
  ADD_TO_CART: "ADD_TO_CART" as const,
  CHECKOUT_REQUEST: "CHECKOUT_REQUEST" as const,
  CHECKOUT_SUCCESS: "CHECKOUT_SUCCESS" as const,
}

export type TCartActionTypes =
  { type: typeof CART_ACTION_NAMES.ADD_TO_CART, payload: { productId: ICartProduct['id'] } }
  | { type: typeof CART_ACTION_NAMES.CHECKOUT_REQUEST, }
  | { type: typeof CART_ACTION_NAMES.CHECKOUT_SUCCESS, }

