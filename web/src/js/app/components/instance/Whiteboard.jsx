/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import BaseHandler from './handlers/BaseHandler.js';
import PencilHandler from './handlers/PencilHandler.js';
import EraserHandler from './handlers/EraserHandler.js';
import LineHandler from './handlers/LineHandler.js';
import RectangleHandler from './handlers/RectangleHandler.js';
import HighlighterHandler from './handlers/HighlighterHandler.js';
export type WhiteboardProps = {
  scaleFactor: number,
  activeTool: string,
  activeColor: string;
  activeSlideId: string;
  sessionId: string,
  sidebarWidth: number,
  drawings: Object[],
  texts: Object[],
};

export type SyntheticUIEventIncludingLayerPosition = {
  nativeEvent: Event & { offsetX: number, offsetY: number, layerX: number, layerY: number };
}

export const DRAWING_TYPES = {
  PENCIL: 'pencil-drawing',
  LINE: 'line-drawing',
  RECTANGLE: 'rectangle-drawing',
  ERASER: 'eraser-drawing',
  OUTLINE_RECTANGLE: 'outline-rectangle-drawing',
  TEXT: 'text-drawing',
  HIGHLIGHT: 'highlight-drawing',
};
const PENCIL_STROKE_WIDTH = 5;
const ERASER_STROKE_WIDTH = 15;
export default class Whiteboard extends BaseComponent {
  props: WhiteboardProps;
  ctx: CanvasRenderingContext2D;
  preDrawCtx: CanvasRenderingContext2D;
  canvas: Element;
  preDrawCanvas: Element;
  handler: BaseHandler;

  constructor(props: WhiteboardProps) {
    super(props);
    this.canvas = null;
    this.preDrawCanvas = null;
  }

  componentDidMount() {
    this.updateCanvasDimensions();
    this.updateCtxInHandler();
  }

  componentWillUpdate(nextProps: WhiteboardProps) {
    this.setHandlers(nextProps.activeTool);
  }

  componentDidUpdate() {
    this.updateCanvasDimensions();
    this.updateCtxInHandler();
  }

  updateCanvasDimensions() {
    let canvas = this.canvas;
    let preDrawCanvas = this.preDrawCanvas;
    this.ctx = canvas.getContext('2d');
    this.preDrawCtx = preDrawCanvas.getContext('2d');
    this.ctx.canvas.width = $(canvas).width();
    this.ctx.canvas.height = $(canvas).height();
    this.preDrawCtx.canvas.width = $(canvas).width();
    this.preDrawCtx.canvas.height = $(canvas).height();

    this.drawDrawings();
  }

  updateCtxInHandler() {
    if (!this.handler) {
      return;
    }
    this.handler.update(this.preDrawCtx, this.props.activeColor, this.props.scaleFactor, this.props.sessionId, this.props.activeSlideId);
  }

  setHandlers(activeTool: string) {
    switch (activeTool) {
      case 'pencil': {
        this.handler = new PencilHandler(this.preDrawCtx, this.props.activeColor, this.props.scaleFactor, this.props.sessionId, this.props.activeSlideId);
        break;
      }
      case 'eraser': {
        this.handler = new EraserHandler(this.preDrawCtx, this.props.activeColor, this.props.scaleFactor, this.props.sessionId, this.props.activeSlideId);
        break;
      }
      case 'line': {
        this.handler = new LineHandler(this.preDrawCtx, this.props.activeColor, this.props.scaleFactor, this.props.sessionId, this.props.activeSlideId);
        break;
      }
      case 'rectangle': {
        this.handler = new RectangleHandler(this.preDrawCtx, this.props.activeColor, this.props.scaleFactor, this.props.sessionId, this.props.activeSlideId, true);
        break;
      }
      case 'rectangle-outline': {
        this.handler = new RectangleHandler(this.preDrawCtx, this.props.activeColor, this.props.scaleFactor, this.props.sessionId, this.props.activeSlideId, false);
        break;
      }
      case 'highlight': {
        this.handler = new HighlighterHandler(this.preDrawCtx, this.props.activeColor, this.props.scaleFactor, this.props.sessionId, this.props.activeSlideId);
        break;
      }
      default: {
        console.debug('tool not supported');
      }
    }
  }

  handleMouseClick(event: SyntheticUIEventIncludingLayerPosition) {
    if (!this.handler) {
      return;
    }
    const x = event.nativeEvent.offsetX || event.nativeEvent.layerX;
    const y = event.nativeEvent.offsetY || event.nativeEvent.layerY;
    this.handler.handleMouseClick(x, y);
  }

  handleMouseDown(event: SyntheticUIEventIncludingLayerPosition) {
    if (!this.handler) {
      return;
    }
    const x = event.nativeEvent.offsetX || event.nativeEvent.layerX;
    const y = event.nativeEvent.offsetY || event.nativeEvent.layerY;
    this.handler.handleMouseDown(x, y);
  }

  handleMouseUp(event: SyntheticUIEventIncludingLayerPosition) {
    if (!this.handler) {
      return;
    }
    const x = event.nativeEvent.offsetX || event.nativeEvent.layerX;
    const y = event.nativeEvent.offsetY || event.nativeEvent.layerY;
    this.handler.handleMouseUp(x, y);
  }

  handleMouseMove(event: SyntheticUIEventIncludingLayerPosition) {
    if (!this.handler) {
      return;
    }
    const x = event.nativeEvent.offsetX || event.nativeEvent.layerX;
    const y = event.nativeEvent.offsetY || event.nativeEvent.layerY;
    this.handler.handleMouseMove(x, y);
  }

  clearCanvas() {
    if (!this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawPencil(drawing: { color: string, path: Array<number> }, erase: boolean = false) {
    if (!this.ctx) {
      return;
    }
    this.ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
    this.ctx.strokeStyle = drawing.color;
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = erase ? ERASER_STROKE_WIDTH : PENCIL_STROKE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(drawing.path[0] * this.props.scaleFactor, drawing.path[1] * this.props.scaleFactor);
    for (let i = 4; i < drawing.path.length; i = i + 2) {
      this.ctx.lineTo(drawing.path[i - 2] * this.props.scaleFactor, drawing.path[i - 1] * this.props.scaleFactor);
      this.ctx.stroke();
    }

    this.ctx.closePath();
    this.ctx.strokeStyle = this.props.activeColor;
  }

  drawLine(drawing: { color: string, coordinates: { fromX: number, fromY: number, toX: number, toY: number } }) {
    if (!this.ctx) {
      return;
    }
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = drawing.color;
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = PENCIL_STROKE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(drawing.coordinates.fromX * this.props.scaleFactor, drawing.coordinates.fromY * this.props.scaleFactor);
    this.ctx.lineTo(drawing.coordinates.toX * this.props.scaleFactor, drawing.coordinates.toY * this.props.scaleFactor);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.strokeStyle = this.props.activeColor;
  }

  drawRectangle(drawing: { color: string, coordinates: { fromX: number, fromY: number, toX: number, toY: number }, filled: boolean}) {
    if (!this.ctx) {
      return;
    }
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = drawing.color;
    this.ctx.fillStyle = drawing.color;
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = PENCIL_STROKE_WIDTH;
    if (drawing.filled) {
      this.ctx.fillRect(
        drawing.coordinates.fromX * this.props.scaleFactor,
        drawing.coordinates.fromY * this.props.scaleFactor,
        drawing.coordinates.toX * this.props.scaleFactor - drawing.coordinates.fromX * this.props.scaleFactor,
        drawing.coordinates.toY * this.props.scaleFactor - drawing.coordinates.fromY * this.props.scaleFactor
      );
    } else {
      this.ctx.strokeRect(
        drawing.coordinates.fromX * this.props.scaleFactor,
        drawing.coordinates.fromY * this.props.scaleFactor,
        drawing.coordinates.toX * this.props.scaleFactor - drawing.coordinates.fromX * this.props.scaleFactor,
        drawing.coordinates.toY * this.props.scaleFactor - drawing.coordinates.fromY * this.props.scaleFactor
      );
    }
    this.ctx.strokeStyle = this.props.activeColor;
  }

  drawDrawings() {
    try {
      this.clearCanvas();
      this.ctx.globalCompositeOperation = 'source-over';
      this.props.drawings.forEach(drawing => {
        switch (drawing.type) {
          case DRAWING_TYPES.PENCIL: {
            this.drawPencil(drawing);
            break;
          }
          case DRAWING_TYPES.ERASER: {
            this.drawPencil(drawing, true);
            break;
          }
          case DRAWING_TYPES.LINE: {
            this.drawLine(drawing);
            break;
          }
          case DRAWING_TYPES.RECTANGLE: {
            this.drawRectangle(drawing);
            break;
          }
          case DRAWING_TYPES.OUTLINE_RECTANGLE: {
            this.drawRectangle(drawing);
            break;
          }
          case DRAWING_TYPES.HIGHLIGHT: {
            this.drawRectangle({...drawing, filled: true});
            break;
          }
          default:
            console.error(`unsupported drawing of type ${drawing.type}`);
        }
      });
    } catch (e) {
      console.warn('Whiteboard.drawDrawings:', e.message);
    }
  }

  render(): React.Component {
    return (
      <div>
        <canvas
          className="whiteboard"
          ref={e => this.canvas = e}
          style={{width: '100%', height: '100%'}}
        />
        <canvas
          ref={e => this.preDrawCanvas = e}
          style={{position: 'absolute', top: 0}}
          onClick={this.handleMouseClick.bind(this)}
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
        />
      </div>
    );
  }
}
