export interface IShopProduct {
  id: string,
  title: string,
  price: number,
  inventory: number,
}

export interface IShopState {
  productsById: { [id: string]: IShopProduct | undefined },
  productIds: string[],
}
