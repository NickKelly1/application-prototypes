import React, { FunctionComponent } from 'react';
import ProductComponent from './CartProductComponent';
import { ICartProduct } from '../../store/cart-state/cart-types';

type TCartComponentProps = {
  products: ICartProduct[],
  total: string,
  onCheckoutClicked: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const CartComponent: FunctionComponent<TCartComponentProps> = ({ products, total, onCheckoutClicked }) => {
  const hasProducts = products.length > 0;
  const nodes = hasProducts ? (
    products.map(product =>
      <ProductComponent
        title={product.title}
        price={product.price}
        quantity={product.quantity}
        key={product.id}
      />
      )
  ) : (
    <em>Please add some products to your cart.</em>
  )

  console.log(' - RENDER [CartComponent]');
  return (
    <div>
      <h3>Your Cart</h3>
      <div>{nodes}</div>
      <p>Total: &#36;{total}</p>
      <button onClick={onCheckoutClicked}
        disabled={hasProducts ? false : true}>
        Checkout
      </button>
    </div>
  );
}

export default CartComponent;
