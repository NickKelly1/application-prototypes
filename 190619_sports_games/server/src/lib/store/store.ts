import {
  Reducer,
  GetStateFunction,
  StoreMiddlewareFunction,
  NextStoreMiddlewareFunction,
  DispatchFunction,
  Store,
  StoreListener,
} from './store.types';

/**
 * @description
 * Create and return a store for managing application state
 */
export const createStore = <UState, UEventPayloads>(
  initialState: UState,
  reducers: Reducer<UState, UEventPayloads>[],
  middleware: StoreMiddlewareFunction<UState, UEventPayloads>[] = [],
): Store<UState, UEventPayloads> => {
  let state: UState = initialState;

  const actionsTaken: UEventPayloads[] = [];

  const listeners: (StoreListener<UState>)[] = [];

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
    action: UEventPayloads,
    dispatch: DispatchFunction<UEventPayloads>,
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
  const dispatch = (action: UEventPayloads) => {
    actionsTaken.push(action);

    // TODO: wrap process in try-catch and revert to pre-actioned state if error is thrown
    // makes state changes act as transactions
    // @note: use InvalidStateChangeException to revert to previous state
    // @note: re-throw other errors

    const mutableState = { ...state };
    const shouldContinue = applyMiddleware(mutableState, action, dispatch);
    if (!shouldContinue) return;

    const newState = reducers.reduce((currentState, reducer) => reducer(currentState, action), mutableState);
    state = newState;
  };

  const subscribe = (listener: StoreListener<UState>) => {
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
