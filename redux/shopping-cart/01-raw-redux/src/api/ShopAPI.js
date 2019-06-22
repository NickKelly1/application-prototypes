import _products from './products.json';

const TIMEOUT = 100;

export default {
  getProducts: (timeout) => new Promise((resolve, reject) => setTimeout(() => resolve(_products)), timeout || TIMEOUT),
  buyProducts: (payload, timeout) => new Promise((resolve, reject) => setTimeout(() => resolve(), timeout || TIMEOUT)),
};
