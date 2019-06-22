import {
  Reducer,
  GetStateFunction,
  StoreMiddlewareFunction,
  NextStoreMiddlewareFunction,
  DispatchFunction,
} from './store.types';

/**
 * @description
 * Create and return a store for managing application state
 */
export const createStore = <UState, UActionTypes>(
  initialState: UState,
  reducers: Reducer<UState, UActionTypes>[],
  middleware: StoreMiddlewareFunction<UState, UActionTypes>[] = [],
) => {
  let state: UState = initialState;

  const actionsTaken: UActionTypes[] = [];

  const listeners: ((state: UState) => void)[] = [];

  const getState: GetStateFunction<UState> = () => state;

  /**
   * @description
   * Fired when trying to take an action on the store
   * Applies middleware to the state & action and determines whether execution should continue
   *
   * @param mutableState
   * @param action
   * @param dispatch
   */
  const applyMiddleware = (
    mutableState: UState,
    action: UActionTypes,
    dispatch: DispatchFunction<UActionTypes>,
  ): boolean => {
    let shouldContinue = true;
    const next: NextStoreMiddlewareFunction = () => (shouldContinue = true);

    middleware.reduce((currentMutableState, nextMiddleware) => {
      if (shouldContinue) {
        shouldContinue = false;
        nextMiddleware(currentMutableState, action, dispatch, next);
      }
      return currentMutableState;
    }, mutableState);

    return shouldContinue;
  };

  /**
   * @description
   * Dispatch an action to the store
   *
   * @param action
   */
  const dispatch = (action: UActionTypes) => {
    actionsTaken.push(action);

    const mutableState = { ...state };
    const shouldContinue = applyMiddleware(mutableState, action, dispatch);
    if (!shouldContinue) return;

    const newState = reducers.reduce((currentState, reducer) => reducer(currentState, action), mutableState);
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
