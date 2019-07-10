import { IState } from "../state-types";
import { IShopProduct } from "./shop-types";
import { createSelector } from "reselect";
import { notUndefined } from "../../helpers/notUndefined";

/**
 * @description
 * Get an object with all the shops products
 */
const getShopProductsById = (state: IState) => state.entities.shop.productsById;


/**
 * @description
 * Get a product from the shop by its id
 */
const getShopProduct = (state: IState, id: IShopProduct['id']) => getShopProductsById(state)[id];


/**
 * @description
 * Get products from the shop in a list
 */
const getShopProductsByList = createSelector(
  (state: IState) => getShopProductsById(state),
  (shopProductsById) => Object.values(shopProductsById),
)


/**
 * @description
 * Get a single product
 */
const getShopProductIds = createSelector(
  (state: IState) => getShopProductsByList(state),
  (shopProductsByList) => shopProductsByList.map(shopProduct => shopProduct.id),
);


/**
 * @description
 * Get an object of products by id, from a set of ids
 */
const getShopProductsFromIdsByList = createSelector(
  (state: IState, idS: IShopProduct['id'][]) => state,
  (state: IState, ids: IShopProduct['id'][]) => ids,
  // invalidate cache if shop products changed
  (state: IState, ids: IShopProduct['id'][]) => getShopProductsById(state),
  (state, ids, shopProductsById) =>
    ids
      .map(id => getShopProduct(state, id))
      .filter(notUndefined)
)


/**
 * @description
 * Get an object of products by id, from a set of ids
 */
const getShopProductsFromIdsById = createSelector(
  (state: IState, ids: IShopProduct['id'][]) => getShopProductsFromIdsByList(state, ids),
  (shopProductsFromIdsList) =>
    Object.fromEntries(
      shopProductsFromIdsList.map(shopProduct => [shopProduct.id, shopProduct])
    ),
)


export const shopSelectors = {
  // first order
  getShopProductsById,
  getShopProduct,

  // aggregate
  getShopProductsByList,
  getShopProductIds,
  getShopProductsFromIdsByList,
  getShopProductsFromIdsById,
};
