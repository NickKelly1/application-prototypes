import React from 'react';
import './App.scss';
import { Example1 } from '../example/Example1';
import { Example2 } from '../example/Example2';
import { Example3 } from '../example/Example3';
import { Example4 } from '../example/Example4';

const App: React.FC = () => {
  return (
    <div className="app">
      {false && <Example1 />}
      {false && <Example2 incomingRequiredProp="aye" />}
      {false && <Example3 incomingRequiredProp="aye" />}
      {true && <Example4 incomingRequiredProp="aye" />}
    </div>
  );
};

export default App;
