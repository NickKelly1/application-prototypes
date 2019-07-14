import React from 'react';
import { shallow } from 'enzyme';
import ProductComponent from './ProductComponent';

const setup = props => {
  const component = shallow(<ProductComponent {...props} />);

  return {
    component
  };
};

describe('Product component', () => {
  it('should render title and price', () => {
    const { component } = setup({ title: 'Test Product', price: 9.99 });
    expect(component.text()).toBe('Test Product - $9.99');
  });

  describe('when given inventory', () => {
    it('should render title, price, and inventory', () => {
      const { component } = setup({ title: 'Test Product', price: 9.99, quantity: 6 });
      expect(component.text()).toBe('Test Product - $9.99 x 6');
    });
  });
});