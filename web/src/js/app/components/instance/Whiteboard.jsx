/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';

export type WhiteboardProps = {
  scaleFactor: number,
};

export default class Whiteboard extends BaseComponent {
  props: WhiteboardProps;

  constructor(props: WhiteboardProps) {
    super(props);
    this.canvas = null;
  }

  render(): React.Component {
    return (
      <canvas className="whiteboard" ref={e => this.canvas = e} style={{width: '100%', height: '100%'}}/>
    );
  }
}
