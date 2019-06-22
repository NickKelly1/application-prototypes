import React, { FC } from 'react';
import ShopContainer from './ShopContainer';
import CartContainer from './CartContainer';
import { ApplicationStoreProvider } from '../providers/application-store-context';

interface IAppProps {
  //
}

const AppContainer: FC<IAppProps> = () => {
  return (
    <ApplicationStoreProvider>
      <div>
        <h2>Shopping Cart Example</h2>
        <hr />
        <ShopContainer />
        <hr />
        <CartContainer />
      </div>
    </ApplicationStoreProvider>
  );
}

export default AppContainer;
