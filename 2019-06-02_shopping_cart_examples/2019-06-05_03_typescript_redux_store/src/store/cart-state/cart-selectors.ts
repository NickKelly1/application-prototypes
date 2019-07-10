import { createSelector } from 'reselect';
import { IState } from "../state-types";
import { shopSelectors } from '../shop-state/shop-selectors';
import { ICartProduct } from "./cart-types";

/**
 * @description
 * Get all cart product ids
 */
const getCartAddedProductIds = (
  state: IState
) => state.entities.cart.addedProductIds;


/**
 * @description
 * Get cart product quantities by id
 */
const getCartProductQuantitiesById = (
  state: IState
) => state.entities.cart.quantityById;


/**
 * @description
 * Get the quantity of a product in the cart
 */
const getCartProductQuantity = (
  state: IState,
  id: ICartProduct['id'],
): number => getCartProductQuantitiesById(state)[id] || 0;


/**
 * Get all the products in the cart (by list)
 */
const getCartProductList: (state: IState) => ICartProduct[] = createSelector(
  (state: IState) => state,
  (state: IState) => getCartAddedProductIds(state),
  // invalidate cache if shop products change
  (state: IState) => shopSelectors.getShopProductsById(state),
  // invalidate cache if quantities changed
  (state: IState) => getCartProductQuantitiesById(state),
  (state, cartAddedProductIds) =>
    shopSelectors
      .getShopProductsFromIdsByList(state, cartAddedProductIds)
      .map(shopProduct => ({
        ...shopProduct,
        quantity: getCartProductQuantity(state, shopProduct.id),
      })),
);


/**
 * @description
 * Get all products in the cart (by id)
 */
const getCartProductsById = createSelector(
  (state: IState) => getCartProductList(state),
  (cartProductList) =>
    Object.fromEntries(
      cartProductList.map(cartProduct => ([
        cartProduct.id,
        cartProduct,
      ])),
    ),
);


/**
 * @description
 * Get the cart total
 */
const getCartTotal = createSelector(
  (state: IState) => getCartProductList(state),
  (cartProductList) =>
    cartProductList.reduce((total, product) => (
      total += product.price * product.quantity
    ), 0).toFixed(2),
);


export const cartSelectors = {
  // first order
  getCartAddedProductIds,
  getCartProductQuantitiesById,

  // aggregate
  getCartProductQuantity,
  getCartProductList,
  getCartProductsById,
  getCartTotal,
};
