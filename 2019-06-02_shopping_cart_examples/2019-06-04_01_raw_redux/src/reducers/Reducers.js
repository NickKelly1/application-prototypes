import { combineReducers } from 'redux';
import CartReducer, * as fromCartReducer from './CartReducer';
import ProductReducer, * as fromProductsReducer from './ProductReducer';

export default combineReducers({
  CartStore: CartReducer,
  ProductStore: ProductReducer
});

/**
 * @description
 * Get added ids from a cart
 *
 * @param {{ CartStore: { addedIds: number[] } }} state
 * @returns { number[] }
 */
const getAddedIds = state => fromCartReducer.getAddedIds(state.CartStore);

/**
 * @description
 * Get a quantity of a product from a cart
 *
 * @param {{ CartStore: { quantityById: { [id: number]: number } } }} state
 * @param { number } id
 * @returns { number }
 */
const getQuantity = (state, id) => fromCartReducer.getQuantity(state.CartStore, id);

/**
 * @description
 * Get a product from a set of products
 *
 * @param {{ ProductStore: { byId: { [id: number]: { id: number, price: number, title: string, } } } }} state
 * @param { number } id
 */
const getProduct = (state, id) => fromProductsReducer.getProduct(state.ProductStore, id);

/**
 * @description
 * Get the total price of a set of products
 *
 * @param {{
 *  CartStore: { addedIds: number[] },
 *  ProductStore: { byId: { [id: number]: { id: number, price: number, title: string, } } },
 *  quantityById: { [id: number]: number },
 * }} state
 * @returns {number}
 */
export const getTotal = state => getAddedIds(state).reduce((total, id) => (
  total + getProduct(state, id).price * getQuantity(state, id)
), 0).toFixed(2);

/**
 * @description
 * Get all products in a cart
 *
 * @param {{
 *  CartStore: { addedIds: number[] },
 *  ProductStore: { byId: { [id: number]: { id: number, price: number, title: string, } } },
 *  quantityById: { [id: number]: number }
 * }} state
 * @returns {{ }}
 */
export const getCartProducts = state => getAddedIds(state).map(id => ({
  ...getProduct(state, id),
  quantity: getQuantity(state, id),
}));