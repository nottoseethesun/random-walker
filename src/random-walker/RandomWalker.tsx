import * as React from 'react';
import * as WS from 'websocket';
import ColorScheme from 'color-scheme';
import './RandomWalker.css';

const START_HUE = 178; // A green.
const COLOR_SCHEME = 'contrast';
const COLOR_VARIATION = 'hard';

type Props = {
  numRobots: number;
  url: string;
  refreshRateMS: number;
};

type State = {
  clearInterval: number;
  colors: string[];
  ws: WS.w3cwebsocket;
};

class RandomWalker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { numRobots, refreshRateMS, url } = props;
    this.state = {
      clearInterval: -1,
      colors: this.getColors(),
      ws: new WS.w3cwebsocket(`${url}?interval=${refreshRateMS}&num_robots=${numRobots}`),
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
      {this.props.numRobots}
      </div>
    );
  }

  private getColors(): string[] {
    const cs = new ColorScheme;
    let colors: string[] = [];
    const hues: number[] = [];
    const COLORS_PER_HUE= 8;
    const HUE_DEGREES = 360;
    const numColorSets = Math.ceil(this.props.numRobots / COLORS_PER_HUE);
    const hueStep = Math.round(HUE_DEGREES / numColorSets);
    for(let i = 0; i < numColorSets; i++) {
      hues.push(START_HUE + (i * hueStep));
    }
    hues.forEach( (hue: number) => {
      const result = cs.from_hue(hue).scheme(COLOR_SCHEME).variation(COLOR_VARIATION);
      colors = colors.concat(result.colors());
    });
    return colors;
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
