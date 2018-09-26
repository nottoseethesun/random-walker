import ColorScheme from 'color-scheme';
import hexAndRgba from 'hex-and-rgba';
import * as React from 'react';
import * as WS from 'websocket';
import './RandomWalker.css';

const SERVER_PING_MSG = 'request-step';

const START_HUE = 178; // A green.
const COLOR_SCHEME = 'contrast';
const COLOR_VARIATION = 'hard';

const ROBOT_ROOT_NAME = 'freight';

type Props = {
  numRobots: number;
  url: string;
  refreshRateMS: number;
  width: number;
  height: number;
};

type State = {
  clearInterval: number;
  currentColor: string;
  colors: string[];
  ws: WS.w3cwebsocket;
  x: number;
  y: number;
};

class RandomWalker extends React.Component<Props, State> {
  private walkCanvas: React.RefObject<HTMLCanvasElement>;
  constructor(props: Props) {
    super(props);
    this.walkCanvas = React.createRef();
    const { numRobots, refreshRateMS, url } = props;
    this.state = {
      clearInterval: -1,
      colors: this.getColors(),
      currentColor: '',
      ws: new WS.w3cwebsocket(`${url}?interval=${refreshRateMS}&num_robots=${numRobots}`),
      x: -1,
      y: -1,
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

  public componentWillUnmount() {
    window.clearInterval(this.state.clearInterval);
  }

  public componentDidUpdate() {
    const { currentColor, x, y } = this.state;
    if (this.walkCanvas.current && !!this.state.currentColor) { // Note: Normally it's best to just return, but TS requires positive check.
      const [red, green, blue, alpha] = hexAndRgba.hexToRgba(`#${currentColor}`);
      const context = this.walkCanvas.current.getContext('2d');
      if (context) {
        context.fillStyle = `rgba(${red},${green},${blue},${alpha}`;
        context.fillRect( x, y, 1, 1 );
      }
    }
  }

  public render() {
    const { width, height } = this.props;
    return (
      <div className="frbtcs-random-walker">
        <canvas ref={this.walkCanvas} width={width} height={height} style={{backgroundColor: '#000000'}} />
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

  private updateState(event: { data: string; }) {
    console.log('- - - update of received event - - - ');
    const data: ServerData = JSON.parse(event.data);
    const { name, x, y } = data;
    const colorIndex = parseInt(name.replace(ROBOT_ROOT_NAME, ''), 10);
    this.setState( {
      currentColor: this.state.colors[colorIndex],
      x,
      y,
    } );
  }

  private fetchAndUpdate() {
    const ws = this.state.ws;
    if (ws.readyState === ws.OPEN) {
      ws.send(SERVER_PING_MSG);
    }
  }

}

//  - - Detail Types

type ServerData = {
  name: string;
  x: number;
  y: number;
};

export default RandomWalker;
