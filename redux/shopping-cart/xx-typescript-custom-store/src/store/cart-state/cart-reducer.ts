import { TActionTypes } from "../state-types";
import { CART_ACTION_NAMES } from "./cart-actions";
import { ICartState } from "./cart-types";

export const cartReducer = (
  state: ICartState,
  action: TActionTypes,
): ICartState => {
  switch (action.type) {
    case CART_ACTION_NAMES.ADD_TO_CART:
      const { productId } = action.payload;

      return {

        addedProductIds:
          state.addedProductIds.includes(productId)
            ? state.addedProductIds
            : [...state.addedProductIds, productId],

        quantityById:
          productId in state.quantityById

            // EDITING THE OBJECT IN PLACE;
            ? Object.fromEntries(
              Object
                .entries(state.quantityById)
                .map(([id, quantity]) => [
                  id,
                  (id === productId && quantity !== undefined)
                    ? quantity + 1
                    : quantity
                ])
            )

            // NOT EDITING THE OBJECT IN PLACE:
            // ? { ...state.quantityById, [productId]: state.quantityById[productId] + 1 }

            // append new product
            : { ...state.quantityById, [productId]: 1 }
      }

    case CART_ACTION_NAMES.CHECKOUT_REQUEST: return state;
    case CART_ACTION_NAMES.CHECKOUT_SUCCESS: return state;
    default: return state;
  }
}
