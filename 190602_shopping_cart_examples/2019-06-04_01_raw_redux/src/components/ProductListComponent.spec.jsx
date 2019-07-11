
import React from 'react';
import { shallow } from 'enzyme';
import ProductListComponent from './ProductListComponent';

const setup = props => {
  const component = shallow(
    <ProductListComponent title={props.title}>{props.children}</ProductListComponent>
  );

  return {
    component,
    children: component.children().at(1),
    h3: component.find('h3'),
  }
}

describe('ProductList component', () => {
  it('should render title', () => {
    const { h3 } = setup({ title: 'Test Products' });
    expect(h3.text()).toMatch(/^Test Products$/);
  });

  it('should render children', () => {
    const { children } = setup({ title: 'Test Products', children: 'Test Children' });
    expect(children.text()).toMatch(/^Test Children$/);
  });
});