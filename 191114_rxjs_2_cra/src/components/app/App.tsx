import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DragZone } from '../drag-zone/drag-zone';

const App: React.FC = () => {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
        <DragZone color='blue' />
    //   </header>
    // </div>
  );
}

export default App;
