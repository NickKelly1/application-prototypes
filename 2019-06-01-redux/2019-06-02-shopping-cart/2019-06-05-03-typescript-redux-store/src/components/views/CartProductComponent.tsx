import React, { FunctionComponent } from 'react'

type TProductComponentProps = {
  title: string,
  quantity: number,
  price: number,
}

const ProductComponent: FunctionComponent<TProductComponentProps> = ({ price, quantity, title }) => {
  console.log(' - RENDER [CartProductComponent]');

  return (
    <div>
      {title} - &#36;{price}{quantity ? ` x ${quantity}` : null}
    </div>
  );
};

export default ProductComponent
