import { combineReducers } from 'redux';
import { RECEIVE_PRODUCTS, ADD_TO_CART } from '../constants/ActionTypes';

/**
 * @description
 * Get a product by its id
 *
 * @param { byId: { [id: number]: { id: number } } } state
 * @param { number } id
 * @returns {{ id: number[] }}
 */
export const getProduct = (state, id) =>
  state.byId[id];



/**
 * @description
 * Get an array of all visible products
 *
 * @param {{ visibleIds: { [id: number]: { id: number } } }} state
 * @returns { {id: number[]}[] }
 */
export const getVisibleProducts = (state) =>
  state.visibleIds.map(id => getProduct(state, id));



/**
 * @description
 * State of a product
 *
 * @param { undefined | { inventory: number }} state   State of the product
 * @param {{ type: string }} action
 *
 * @returns { undefined | { inventory: number } }
 */
const products = (state, action) => {
  switch (action.type) {
    // Add an instance to a cart and remove from the inventory
    case ADD_TO_CART:
        return {
        ...state,
        inventory: state.inventory - 1
      };
    default: return state;
  }
};


/**
 * @description
 * State of products by id
 *
 * @param {{ [id: number]: { id: number } }} state  object of products by id
 * @param {{ type: string, products?: { id: number, price: number, title: string, }[], productId?: number }} action
 *
 * @returns {{ [id: number]: { id: number }}
 */
const byId = (state = {}, action) => {
  switch (action.type) {

    // Add given products to the state (list of products by id), indexed by their id's
    case RECEIVE_PRODUCTS: return {
      ...state,
      ...action.products.reduce((obj, product) => {
        obj[product.id] = product;
        return obj;
      }, {}),
    }

    // Add requested product to the state (object of products by id) by its id
    default:
      const { productId } = action;
      if (productId) {
        return {
          ...state,
          [productId]: products(state[productId], action),
        }
      }
      return state;
  }
};



/**
 * @description
 * State of visible products
 *
 * @param { number[] } state
 * @param {{ type: string, products: { id: number }[] }} action
 *
 * @returns { number[] }
 */
const visibleIds = (state = [], action) => {
  switch (action.type) {

    // Receive products
    case RECEIVE_PRODUCTS: return action.products.map(product => product.id);

    // No change
    default: return state;
  }
};



export default combineReducers({
  byId,
  visibleIds,
});
