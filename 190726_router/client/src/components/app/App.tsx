import React from 'react';
import './App.css';
import Router from '../router/Router';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div>App</div>
      </header>
      <Router />
    </div>
  );
};

export default App;
