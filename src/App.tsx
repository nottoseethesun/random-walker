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
        <RandomWalker numRobots={8} refreshRateMS={20} url={'ws://localhost:8000/api/streams/robots/positions/'} width={500} height={500} />
      </div>
    );
  }
}

export default App;
