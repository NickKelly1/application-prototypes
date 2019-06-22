export type DispatchFunction<UActionTypes> = (action: UActionTypes) => void;

export type GetStateFunction<UState> = () => UState;

export type Reducer<UState, UActionTypes> = (state: UState, action: UActionTypes) => UState;

export type ThunkAction<UState, UActionTypes, R = void> = (
  dispatch: DispatchFunction<UActionTypes>,
  getState: GetStateFunction<UState>,
) => R;

export type NextStoreMiddlewareFunction = () => {};

export type StoreMiddlewareFunction<UState, UActionTypes> = (
  state: UState,
  action: UActionTypes,
  dispatch: DispatchFunction<UActionTypes>,
  next: NextStoreMiddlewareFunction,
) => void;
