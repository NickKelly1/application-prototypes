import { StoreMiddlewareFunction, DispatchFunction, NextStoreMiddlewareFunction, ThunkAction } from '../store.types';

/**
 * @todo get this working with store types
 *
 * @description
 * Allow dispatch of "thunks" to the store
 *
 * @param state
 * @param action
 * @param dispatch
 * @param next
 */
export const thunkStoreMiddleware = <T, UState, UActionTypes>(
  state: UState,
  action: T extends Function ? ThunkAction<UState, UActionTypes> : UActionTypes,
  dispatch: DispatchFunction<UActionTypes>,
  next: NextStoreMiddlewareFunction,
) => {
  if (!(typeof action === 'function')) {
    next();
    return;
  }
  // assume thunk action
  action(state, dispatch);
  // do not continue execution
  return;
};
