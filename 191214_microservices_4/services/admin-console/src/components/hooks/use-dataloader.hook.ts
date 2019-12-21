import { useEffect, useState, useReducer, Reducer } from "react";

export type LazyOrPromise<T> = Promise<T> | (() => Promise<T>);

export type DataloaderState<T, E> =
// loading
| {
  data:  undefined,
  error: undefined,
  loading: true,
}
// errored
| {
  data:  undefined,
  error: E,
  loading: false,
}
// loaded
| {
  data:  T,
  error: undefined,
  loading: false,
}

export type DataloaderAction<T, E> =
  | { type: 'loading' }
  | { type: 'data', data: T }
  | { type: 'error', error: E }


export function dataLoaderReducer<T, E>(
  prevState: DataloaderState<T, E>,
  action: DataloaderAction<T, E>
): DataloaderState<T, E> {
  switch (action.type) {
    case 'loading': return {
      data: undefined,
      error: undefined,
      loading: true,
    }
    case 'data': return {
      data: action.data,
      error: undefined,
      loading: false,
    };
    case 'error': return {
      data: undefined,
      error: action.error,
      loading: false,
    }
    default: throw new TypeError(`Unhandled aciton type "${(action as any).type}"`);
  }
}


export interface CancelToken { cancelled: boolean }

export function createCancelToken(): CancelToken {
  const token: CancelToken = { cancelled: false };
  return token;
}

export function useDataloader<T>(loadWith: LazyOrPromise<T>): DataloaderState<T, any> {
  const [ state, dispatch ] = useReducer<Reducer<DataloaderState<T, any>, DataloaderAction<T, any>>>(
    dataLoaderReducer,
    {
      data: undefined,
      error: undefined,
      loading: false
    }
  );
  const [ prevToken, setPrevToken ] = useState(() => createCancelToken());

  useEffect(() => {
    // cancel previous
    prevToken.cancelled = true;
    const token = createCancelToken();
    setPrevToken(token);

    dispatch({ type: 'loading' });
    (typeof loadWith === 'function' ? loadWith() : loadWith)
      .then(result => { !token.cancelled && dispatch({ type: 'data', data: result }) })
      .catch(error => { !token.cancelled && dispatch({ type: 'error', error }) });
  }, [ loadWith ]);

  return state;
}
