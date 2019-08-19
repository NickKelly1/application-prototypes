import './CartItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';

const propTypes = {
  launchId: PropTypes.string.isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * CartItem
 *
 * @param props
 */
const CartItem: React.FC<PropTypes> = ({ launchId }) => {
  return (
    <div>
      TODO: CartItem ({launchId})
    </div>
  );
};

CartItem.propTypes = propTypes;
CartItem.defaultProps = defaultProps;

export default CartItem;