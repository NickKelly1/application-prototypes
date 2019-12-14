import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { WelcomePage } from './pages/welcome/welcome.page';
import * as serviceWorker from './serviceWorker';
import { AuthServiceProvider } from './providers/auth-service/auth-service.provider';

ReactDOM.render(
  (
    <AuthServiceProvider>
      <WelcomePage />
    </AuthServiceProvider>
  ),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
