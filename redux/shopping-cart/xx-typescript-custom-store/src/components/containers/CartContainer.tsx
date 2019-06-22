import React, { FunctionComponent, useContext } from 'react'
import CartComponent from '../views/CartComponent'
import { ICartProduct } from '../../store/cart-state/cart-types';
import { ApplicationStoreContext } from '../providers/application-store-context';

interface ICartContainerProps {
  //
}

const CartContainer: FunctionComponent<ICartContainerProps> = () => {
  const { cart } = useContext(ApplicationStoreContext);

  const products = cart.selectors.getProducts();
  const total = cart.selectors.getTotal();
  const checkout = cart.commands.checkout;

  /**
   * @description
   * Fired when a product is added to the cart
   *
   * @param event
   * @param product
   */
  const handleCheckoutClicked = <UElement extends HTMLElement, UEvent extends UIEvent>(
    event: React.MouseEvent<UElement, UEvent>,
    products: ICartProduct[]
  ) => {
    checkout(products);
  }

  return (
    <CartComponent
      products={products}
      total={total}
      onCheckoutClicked={(e) => handleCheckoutClicked(e, products)} />
  )
}

export default CartContainer;
