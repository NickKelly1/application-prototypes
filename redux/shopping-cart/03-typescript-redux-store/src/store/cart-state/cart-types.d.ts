import { IShopProduct } from "../shop-state/shop-types";

export interface ICartState {
  addedProductIds: IShopProduct['id'][],
  quantityById: { [id: string]: number },
}

export interface ICartProduct {
  id: IShopProduct['id'],
  title: IShopProduct['title'],
  price: IShopProduct['price'],
  quantity: number,
}