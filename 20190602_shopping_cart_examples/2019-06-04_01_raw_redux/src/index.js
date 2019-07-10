import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import Reducers from './reducers/Reducers';
import { getAllProducts } from './actions/Actions';
import AppContainer from './containers/AppContainer';

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production')
  middleware.push(createLogger());

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

const store = createStore(
  Reducers,
  composeEnhancers(applyMiddleware(...middleware))
);

store.dispatch(getAllProducts());

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
