import * as React from 'react';
import './App.css';

import RandomWalker from './random-walker/RandomWalker';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Test Harness for Random Walker</h1>
        </header>
        <RandomWalker numRobots={2} refreshRateMS={50} url={'ws://localhost:8000/api/streams/robots/positions/'} />
      </div>
    );
  }
}

export default App;
