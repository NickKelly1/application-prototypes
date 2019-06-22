import React, { FunctionComponent } from 'react';
import { IShopProduct } from "../../store/shop-state/shop-types";
import ShopProductListComponent from '../views/ShopProductListComponent';
import ShopProductItemComponent from '../views/ShopProductItemComponent';
import { connect } from 'react-redux';
import { IState, TActionTypes } from '../../store/state-types';
import { Dispatch, bindActionCreators } from 'redux';
import { cartActions } from '../../store/cart-state/cart-actions';
import { shopSelectors } from '../../store/shop-state/shop-selectors';

interface IShopContainerProps {
  shopProducts: IShopProduct[],
  addToCart: (productId: IShopProduct['id']) => void,
}

export const ShopContainer: FunctionComponent<IShopContainerProps> = ({ shopProducts, addToCart }) => {

  /**
   * @description
   * Fired when a shopProduct is added to the cart
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

  console.log(' - RENDER [ShopContainer]');
  return (
    <ShopProductListComponent title="Products">
      {shopProducts.map(shopProduct => (
        <ShopProductItemComponent
          key={shopProduct.id}
          product={shopProduct}
          onAddToCartClicked={(e) => handleAddToCartClicked(e, shopProduct)}
        />
      ))}
    </ShopProductListComponent>
  );
}

/**
 * @description
 * Map application state to component props
 */
const mapStateToProps = (state: IState) => {
  console.log(' - mapStateToProps [ShopContainer]');
  return {
    shopProducts: shopSelectors.getShopProductsByList(state),
  };
}

/**
 * @description
 * Map action dispatchers to component props
 */
const mapDispatchToProps = (dispatch: Dispatch<TActionTypes>) => {
  console.log(' - mapDispatchToProps [ShopContainer]');
  const actions = bindActionCreators({
    addToCart: cartActions.addProducts
  }, dispatch);

  return actions;
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopContainer);
