import { TReducer } from "./store-types";

export const createStore = <
  UState extends {},
  UActionTypes extends {},
>(
  initialState: UState,
  reducers: TReducer<UState, UActionTypes>[],
) => {
  let state: UState = initialState;

  const actionsTaken: UActionTypes[] = [];

  const listeners: ((state: UState) => any)[] = [];

  const getState = () => state;

  const dispatch = (action: UActionTypes) => {
    actionsTaken.push(action);
    const newState = reducers.reduce((currentState, reducer) => reducer(currentState, action), state);
    state = newState;
  };

  const subscribe = (listener: typeof listeners[0]) => {
    listeners.push(listener);
    return function (): void {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    }
  }

  return {
    /**
     * @description
     * Get the state
     *
     * @returns state
     */
    getState,

    /**
     * @description
     * Listen for changes
     *
     * @returns unsubscribe function
     */
    subscribe,

    /**
     * @description
     * Dispatch an action to the store
     *
     * @returns void
     */
    dispatch,
  };
}