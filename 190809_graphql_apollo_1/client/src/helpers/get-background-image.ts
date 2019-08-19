import galaxy from '../assets/images/galaxy.jpg';
import iss from '../assets/images/iss.jpg';
import moon from '../assets/images/moon.jpg';

const backgrounds = [galaxy, iss, moon];

/**
 * @description
 * Get a background image for the input
 *
 * @param input
 */
function getBackgroundImage(input: any) {
  // if !Number.isFinite(input) then (Number(input) mod n === NaN) -> hence || 0
  const backgroundIndex = (Number(input) % backgrounds.length) || 0;
  return `url(${backgrounds[backgroundIndex]})`;
}

export default getBackgroundImage;
