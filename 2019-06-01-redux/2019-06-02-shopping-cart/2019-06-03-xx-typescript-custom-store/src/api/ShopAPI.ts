import _products from './products.json'
import { IShopProduct } from '../store/shop-state/shop-types.js';
import { ICartProduct } from '../store/cart-state/cart-types.js';

const DEFAULT_TIMEOUT = 100;

/**
 * @description
 * Check if products received are as expected
 *
 * @param products
 */
function productsAreValid(products: any): products is IShopProduct[] {
  // TODO: proper validation
  if (
    products instanceof Array
    && products.every(product => (
      product instanceof Object
      && typeof product.id === 'string'
      && typeof product.title === 'string'
      && typeof product.inventory === 'number'
      && typeof product.price === 'number'
    ))
  ) return true

  return false;
}

const ShopAPI = {
  /**
   * @description
   * Fetch products
   */
  fetchProducts: (timeout?: number) => new Promise<IShopProduct[]>((resolve, reject) => setTimeout(() => {
    // check if products are valid
    if (productsAreValid(_products))
      resolve(_products);

    // error
    else
      reject(new Error('Error fetching products from ShopAPI'));

  }, timeout || DEFAULT_TIMEOUT)),

  buyProducts: (payload: ICartProduct[], timeout?: number) => new Promise((resolve, reject) => setTimeout(() => {
    resolve();
  }, timeout || DEFAULT_TIMEOUT)),
}

export default ShopAPI;
