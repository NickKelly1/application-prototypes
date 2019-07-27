/**
 * @description
 * Get a random integer between a max and min
 *
 * @param min
 * @param max
 */
export const randomInt = (min: number = 0, max: number = 10) => min + 1 + Math.floor((max - min) * Math.random());
