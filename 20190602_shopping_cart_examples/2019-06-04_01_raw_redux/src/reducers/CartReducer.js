import {
  ADD_TO_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_FAILURE
} from '../constants/ActionTypes';

const initialState = {
  addedIds: [],
  quantityById: {}
};

/**
 * @description
 * AddedIds reducer
 *
 * @param {{ addedIds: number[] }} state
 * @param {{ type: string, productId?: number }} action
 */
export const addedIds = (state = initialState.addedIds, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      if (state.indexOf(action.productId) !== -1) return state;
      return [...state, action.productId];
    default: return state;
  }
}

/**
 * @description
 * quantityById reducer
 *
 * @param {{ quantityById: { [id: number]: number } }} state
 * @param {{ type: string, productId?: number }} action
 */
export const quantityById = (state = initialState.quantityById, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { productId } = action;
      return {
        ...state,
        [productId]: (state[productId] || 0) + 1
      };
    default: return state;
  }
}

/**
 * @description
 * Get quantity of a product id
 *
 * @param {{ quantityById: { [id: number]: id: number } }} state
 * @param { number } productId
 */
export const getQuantity = (state, productId) => state.quantityById[productId] || 0;

/**
 * @description
 * Get all addedIds
 *
 * @param {{ addedIds: number[] }} state
 * @returns { number[] }
 */
export const getAddedIds = state => state.addedIds;

/**
 * @description
 * Redux Cart Reducer
 *
 * @param {{ addedIds: number[], quantityById: { [id: number]: id: number } }} state
 * @param {{ type: string, productId?: number }} action
 */
const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECKOUT_REQUEST: return initialState;
    case CHECKOUT_FAILURE: return action.cart;
    default: return {
      addedIds: addedIds(state.addedIds, action),
      quantityById: quantityById(state.quantityById, action),
    }
  }
};


export default CartReducer;
