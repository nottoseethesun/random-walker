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
  WS: WS.w3cwebsocket;
};

class RandomWalker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { paths, refreshRateMS, url } = props;
    // Avoid changing internal (encapsulated) state via reference to prop:
    this.state = {
      WS: new WS.w3cwebsocket(`${url}?interval=${refreshRateMS}&numRobots=${paths.length}`),
      clearInterval: -1,
      paths: clone(paths),
    };
    const title = 'random-walker ws client';  // @to-do: move the user-facing messages out to user-text file
    this.state.WS.onerror = (err) => {
      console.error(`${title} reports a problem:`);
      console.error(err);
    };
    this.state.WS.onclose = () => {
      console.info(`${title} closed`);
    };
    this.state.WS.onopen = () => {
      console.info(`${title} connected`);
    };
    this.state.WS.onmessage = this.updateState.bind(this);
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
    this.state.WS.send('ping');
  }

}

export default RandomWalker;
