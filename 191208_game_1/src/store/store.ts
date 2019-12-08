import { createStore, applyMiddleware } from 'redux';
import { masterReducer } from './store.reducer';
import { epicMiddleware, createMasterStoreEpic } from './store.epic';

/**
 * @description
 * Create a master store
 */
export function createMasterStore(socketServer: SocketIO.Server) {
  const store = createStore(masterReducer, applyMiddleware(epicMiddleware));
  epicMiddleware.run(createMasterStoreEpic(socketServer, store));
  return store;
}
