import CartReducer from './CartReducer';
import {
  ADD_TO_CART,
  CHECKOUT_REQUEST,
} from '../constants/ActionTypes';

describe('reducers', () => {
  describe('cart', () => {
    const initialState = {
      addedIds: [],
      quantityById: {}
    }

    it('should provide the initial state', () => {
      expect(CartReducer(undefined, {})).toEqual(initialState);
    });

    it(`should handle ${ CHECKOUT_REQUEST } action`, () => {
      expect(CartReducer({}, { type: CHECKOUT_REQUEST })).toEqual(initialState);
    });

    it(`should handle ${ ADD_TO_CART } action`, () => {
      expect(CartReducer(initialState, { type: ADD_TO_CART, productId: 1 })).toEqual({
        addedIds: [ 1 ],
        quantityById: { 1: 1 },
      })
    });

    describe('when product is already in cart', () => {
      it(`should handle ${ ADD_TO_CART } action`, () => {
        const state = {
          addedIds: [ 1, 2 ],
          quantityById: { 1: 1, 2: 1 }
        }

        expect(CartReducer(state, { type: ADD_TO_CART, productId: 2 })).toEqual({
          addedIds: [ 1, 2 ],
          quantityById: { 1: 1, 2: 2 }
        });
      });
    });
  });
});