import React from 'react';
import './App.scss';
import { Example1 } from '../example/Example1';
import { Example2 } from '../example/Example2';
import { Example3 } from '../example/Example3';

const App: React.FC = () => {
  return (
    <div className="app">
      {false && <Example1 />}
      {false && <Example2 incomingRequiredProp="aye" />}
      {true && <Example3 incomingRequiredProp="aye" />}
    </div>
  );
};

export default App;
