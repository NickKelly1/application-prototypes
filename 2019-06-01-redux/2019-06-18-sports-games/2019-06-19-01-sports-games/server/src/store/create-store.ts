import { Reducer, GetState } from '../../@types/store';

/**
 * @description
 * Create and return a store for managing application state
 */
export const createStore = <UState extends {}, UActionTypes extends {}>(
  initialState: UState,
  reducers: Reducer<UState, UActionTypes>[],
) => {
  let state: UState = initialState;

  const actionsTaken: UActionTypes[] = [];

  const listeners: ((state: UState) => void)[] = [];

  const getState: GetState<UState> = () => state;

  const dispatch = (action: UActionTypes) => {
    actionsTaken.push(action);
    const newState = reducers.reduce((currentState, reducer) => reducer(currentState, action), state);
    state = newState;
  };

  const subscribe = (listener: typeof listeners[0]) => {
    listeners.push(listener);
    return function(): void {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    };
  };

  return {
    /**
     * @description
     * Get the state
     */
    getState,

    /**
     * @description
     * Listen for changes
     */
    subscribe,

    /**
     * @description
     * Dispatch an action to the store
     */
    dispatch,
  };
};
