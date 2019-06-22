import React, { FC } from 'react'
import { IShopProduct } from '../../store/shop-state/shop-types';

interface IShopProductComponentProps {
  product: IShopProduct,
}

const ShopProductComponent: FC<IShopProductComponentProps> = ({ product }) => (
  <div>
    {product.title} - &#36;{product.price}{product.inventory ? ` x ${product.inventory}` : null}
  </div>
)

export default ShopProductComponent
