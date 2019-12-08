
export type XYVec = { x: number, y: number };

export interface Player {
  name: string;
  position: XYVec;
}

/**
 * @description
 * Create a player
 * 
 * @param options 
 */
export function createPlayer(options: { name: string }): Player {
  return {
    name: options.name,
    position: { x: 0, y: 0 },
  };
}
