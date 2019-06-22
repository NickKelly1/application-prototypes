import React, { FunctionComponent, useContext } from 'react';
import { IShopProduct } from "../../store/shop-state/shop-types";
import { ApplicationStoreContext } from '../providers/application-store-context';
import ShopProductListComponent from '../views/ShopProductListComponent';
import ShopProductItemComponent from '../views/ShopProductItemComponent';

interface IShopContainerProps {
  //
}

export const ShopContainer: FunctionComponent<IShopContainerProps> = () => {
  const { shop, cart } = useContext(ApplicationStoreContext);

  const products = shop.selectors.getProducts();
  const addToCart = cart.commands.addProducts

  /**
   * @description
   * Fired when a product is added to the cart
   *
   * @param event
   * @param product
   */
  const handleAddToCartClicked = <UElement extends HTMLElement, UEvent extends UIEvent>(
    event: React.MouseEvent<UElement, UEvent>,
    product: IShopProduct
  ) => {
    addToCart(product.id);
  }

  return (
    <ShopProductListComponent title="Products">
      {products.map(product => (
        <ShopProductItemComponent
          key={product.id}
          product={product}
          onAddToCartClicked={(e) => handleAddToCartClicked(e, product)}
        />
      ))}
    </ShopProductListComponent>
  );
}

export default ShopContainer;
