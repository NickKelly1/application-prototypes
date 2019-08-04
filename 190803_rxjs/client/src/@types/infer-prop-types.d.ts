import PropTypes from 'prop-types';

// https://dev.to/busypeoples/notes-on-typescript-inferring-react-proptypes-1g88
export type InferPropTypes<TPropTypes, TDefaultProps = {}, TProps = PropTypes.InferProps<TPropTypes>> = {
  [K in keyof TProps]: K extends keyof TDefaultProps ? TProps[K] | TDefaultProps[K] : TProps[K];
};
