import './FourZeroFourPage.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../app/routes';
import { InferPropTypes } from '../../../@types/infer-prop-types';

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * FourZeroFourPage
 *
 * @param props
 */
const FourZeroFourPage: React.FC<PropTypes> = (props) => {
  return (
    <div className="four-zero-four-page">
      <div>
        Page could not be found
      </div>
      {/* TODO: Link */}
      <Link to={ROUTES.HOME_PAGE.get()}>Home</Link>
    </div>
  );
};

FourZeroFourPage.propTypes = propTypes;
FourZeroFourPage.defaultProps = defaultProps;

export default FourZeroFourPage;