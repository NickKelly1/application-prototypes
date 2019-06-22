export interface ICartState {
  addedProductIds: string[],
  quantityById: { [id: string]: number | undefined },
}

export interface ICartProduct {
  id: string,
  title: string,
  price: number,
  quantity: number,
}