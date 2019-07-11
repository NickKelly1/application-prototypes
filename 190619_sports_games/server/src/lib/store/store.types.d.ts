export type StoreListener<UState> = (state: UState) => void;

export type SubscribeFunction<UState> = (listener: StoreListener<UState>) => void;

export type DispatchFunction<UEventPayloads> = (action: UEventPayloads) => void;

export type GetStateFunction<UState> = () => UState;

export type Reducer<UState, UEventPayloads> = (state: UState, action: UEventPayloads) => UState;

export type ThunkAction<UState, UEventPayloads, R = void> = (
  dispatch: DispatchFunction<UEventPayloads>,
  getState: GetStateFunction<UState>,
) => R;

export type NextStoreMiddlewareFunction = () => {};

export type StoreMiddlewareFunction<UState, UEventPayloads> = (
  state: UState,
  action: UEventPayloads,
  dispatch: DispatchFunction<UEventPayloads>,
  next: NextStoreMiddlewareFunction,
) => void;

export interface Store<UState, UEventPayloads> {
  getState: GetStateFunction<UState>;
  dispatch: DispatchFunction<UEventPayloads>;
  subscribe: SubscribeFunction<UState>;
}
