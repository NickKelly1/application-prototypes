import './Header.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '../../@types/infer-prop-types';
import dog1 from '../../assets/images/dog-1.png';
import dog2 from '../../assets/images/dog-2.png';
import dog3 from '../../assets/images/dog-3.png';
import { logger, LOG_COLOURS } from '../../helpers/logger';

const ALPHABET_SIZE = 25;
const CHAR_CODE_A = 97;
const avatars = [dog1, dog2, dog3];

/**
 * @description
 * Get the avatar corresponding to the first letter of a string
 *
 * @param email
 */
function avatarFromFirstLetter(ofString: string) {
  const firstLetterIndex = ofString.toLowerCase().charCodeAt(0) - CHAR_CODE_A;
  const percentile = Math.max(0, Math.min(ALPHABET_SIZE, firstLetterIndex)) / ALPHABET_SIZE;
  return avatars[Math.round(avatars.length * percentile)];
}

const propTypes = {
  image: PropTypes.string,
  children: PropTypes.node,
};
const defaultProps = {
  image: null,
  children: 'Space Explorer',
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

/**
 * @description
 * Header
 *
 * @param props
 */
const Header: React.FC<PropTypes> = ({ children, image }) => {
  // TODO: obtain email from local storage
  const email = 'test email';
  logger('Header::render', { message: 'TODO: email', colour: LOG_COLOURS.RED });
  const avatar = image || avatarFromFirstLetter(email);

  return (
    <div className="header container">
      <img src={avatar} alt="space dog" />
      <div>
        <h2>{children}</h2>
        <div className="sub-heading">{email}</div>
      </div>
    </div>
  )
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
