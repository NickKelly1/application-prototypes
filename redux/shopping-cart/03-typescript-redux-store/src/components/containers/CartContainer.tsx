import React, { FunctionComponent } from 'react'
import CartComponent from '../views/CartComponent'
import { ICartProduct } from '../../store/cart-state/cart-types';
import { IState, TActionTypes } from '../../store/state-types';
import { Dispatch, bindActionCreators } from 'redux';
import { cartActions } from '../../store/cart-state/cart-actions';
import { connect } from 'react-redux';
import { cartSelectors } from '../../store/cart-state/cart-selectors';

interface ICartContainerProps {
  total: string,
  checkout: (products: ICartProduct[]) => void,
  products: ICartProduct[],
}

const CartContainer: FunctionComponent<ICartContainerProps> = ({products, checkout, total}) => {
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

  console.log(' - RENDER [CartContainer]');
  return (
    <CartComponent
      products={products}
      total={total}
      onCheckoutClicked={(e) => handleCheckoutClicked(e, products)} />
  )
}

/**
 * @description
 * Map application state to component props
 */
const mapStateToProps = (state: IState) => {
  console.log(' - mapStateToProps [CartContainer]');
  return {
    products: cartSelectors.getCartProductList(state),
    total: cartSelectors.getCartTotal(state),
  };
}


/**
 * @description
 * Map action dispatchers to component props
 */
const mapDispatchToProps = (dispatch: Dispatch<TActionTypes>) => {
  console.log(' - mapDispatchToProps [CartContainer]');
  const actions = bindActionCreators({
    checkout: cartActions.checkout
  }, dispatch);

  return actions;
}

export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);
