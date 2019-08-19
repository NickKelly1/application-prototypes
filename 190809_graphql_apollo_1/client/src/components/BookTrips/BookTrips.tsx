import './BookTrips.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import { logger } from '../../helpers/logger';

const propTypes = {
  // TODO: Fix any
  cartItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * BookTrips
 *
 * @param props
 */
const BookTrips: React.FC<PropTypes> = ({ cartItems }) => {
  logger('BookTrips::render', { message: { cartItems } });
  return (
    <div>
      TODO: BookTrips
    </div>
  );
};

BookTrips.propTypes = propTypes;
BookTrips.defaultProps = defaultProps;

export default BookTrips;