import products from './products';

export default {
  getProducts: async function() {
    // imitate the response from fetch
    return { json: () => new Promise((resolve, reject) => resolve(products)), }
  },
};
