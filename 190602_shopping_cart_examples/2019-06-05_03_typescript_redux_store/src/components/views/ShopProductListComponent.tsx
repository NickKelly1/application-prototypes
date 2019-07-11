import React, { FC } from 'react';

interface IShopProductListComponentProps {
  title: string,
}

const ShopProductListComponent: FC<IShopProductListComponentProps> = ({ title, children }) => {
  console.log(' - RENDER [ShopProductListComponent]');

  return (
    <div>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

export default ShopProductListComponent;
