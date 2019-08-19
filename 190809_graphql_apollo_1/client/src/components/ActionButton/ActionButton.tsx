import './ActionButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * ActionButton
 *
 * @param props
 */
const ActionButton: React.FC<PropTypes> = (props) => {
  return (
    <div className="action-button">
      TODO: ActionButton
    </div>
  )
};

ActionButton.propTypes = propTypes;
ActionButton.defaultProps = defaultProps;

export default ActionButton;