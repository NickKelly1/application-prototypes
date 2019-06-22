export type TDispatchFunction<UActionTypes extends {}> = (action: UActionTypes) => any;

export type TGetStateFunction<UState extends {}> = () => UState;

export type TReducer<
  UState extends {},
  UActionTypes extends {}
> = (
  state: UState,
  action: UActionTypes
) => UState;

export type TActionDispatcherBinder<
  UState extends {},
  UActionTypes extends {},
  R extends {},
> = (dispatch: TDispatchFunction<UActionTypes>, getState: TGetStateFunction<UState>) => R;