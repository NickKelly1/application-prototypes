import React, { FC } from 'react';
import { IShopProduct } from '../../store/shop-state/shop-types';
import ShopProductComponent from './ShopProductComponent';

interface IShopProductItemComponentProps {
  product: IShopProduct,
  onAddToCartClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
};

const ShopProductItemComponent: FC<IShopProductItemComponentProps> = ({ product, onAddToCartClicked }) => {
  console.log(' - RENDER [ShopProductItemComponent]');

  return (
    <div style={{ marginBottom: 20 }}>
      <ShopProductComponent product={product} />
      <button
        onClick={onAddToCartClicked}
        disabled={product.inventory > 0 ? false : true}>
        {product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
      </button>
    </div>
  );
}

export default ShopProductItemComponent;
