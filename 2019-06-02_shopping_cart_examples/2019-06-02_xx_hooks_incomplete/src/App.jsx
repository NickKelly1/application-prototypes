import React, { useContext, useEffect } from 'react';
import { ShopContext, SHOP_ACTIONS } from './providers/ShopContext';
import ShopAPI from './api/ShopAPI';


function App() {
  const { shopState, dispatchToShop } = useContext(ShopContext);

  console.log(shopState);

  const { productIds, productsById } = shopState;

  async function fetchDataAction() {
    const data = await ShopAPI.getProducts();
    const products = await data.json();
    return dispatchToShop({
      type: SHOP_ACTIONS.FETCH_PRODUCTS,
      payload: { products },
    });
  }

  useEffect(() => { productIds.length === 0 && fetchDataAction(); });

  return (
    <>
      <div>App</div>
      {productIds.map(id => {
        const { title, price, inventory } = productsById[id];
        return (
          <div>{title} ({inventory}) - &#36;{price}</div>
        );
      })}
    </>
  );
}

export default App;
