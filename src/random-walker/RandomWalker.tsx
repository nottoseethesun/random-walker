import * as clone from 'clone';
import * as React from 'react';
import * as WS from 'websocket';
import './RandomWalker.css';

type Point = {
  x: number;
  y: number;
};

type WalkerPath = {
  points: Point[];
};

type Paths = {
  paths: WalkerPath[];
};

type Props = Paths & {
  url: string;
  refreshRateMS: number;
};

type State = Paths & {
  clearInterval: number;
  ws: WS.w3cwebsocket;
};

class RandomWalker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { paths, refreshRateMS, url } = props;
    this.state = {
      clearInterval: -1,
      paths: clone(paths), // Important: void changing internal (encapsulated) state via reference to prop.
      ws: new WS.w3cwebsocket(`${url}?interval=${refreshRateMS}&num_robots=${paths.length}`),
    };
    const title = 'random-walker ws client';  // @to-do: move the user-facing messages out to user-text file
    this.state.ws.onerror = (err) => {
      console.error(`${title} reports a problem:`);
      console.error(err);
    };
    this.state.ws.onclose = () => {
      console.info(`${title} closed`);
    };
    this.state.ws.onopen = () => {
      console.info(`${title} connected`);
    };
    this.state.ws.onmessage = this.updateState.bind(this);
  }

  public componentDidMount() {
    const clearInterval = window.setInterval(this.fetchAndUpdate.bind(this), this.props.refreshRateMS);
    this.setState( {
      clearInterval
    });
  }

  public render() {
    return (
      <div className="frbtcs-random-walker">
      {this.state.paths[0].points[0].x}
      </div>
    );
  }

  private updateState(event: { data: {}; }) {
    console.log('- - - update of received event - - - ');
    console.log(event);
  }

  private fetchAndUpdate() {
    const ws = this.state.ws;
    if (ws.readyState === ws.OPEN) {
      ws.send('ping');
    }
  }

}

export default RandomWalker;
