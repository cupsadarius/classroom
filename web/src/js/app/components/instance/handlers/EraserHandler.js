/* @flow */

import BaseHandler from './BaseHandler.js';
import SocketActions from '../../../actions/SocketActions.js';
const STROKE_WIDTH = 15;

export default class EraserHandler extends BaseHandler {
  path: Array<number>;

  constructor(ctx: CanvasRenderingContext2D, color: string, scaleFactor: number, sessionId: string, slideId: string) {
    super(ctx, color, scaleFactor, sessionId, slideId);
    this.path = [];
    this.shouldHandle = false;
  }

  handleMouseDown(x: number, y: number) {
    this.shouldHandle = true;
    const startCoordinates = {
      x: Math.round(x),
      y: Math.round(y),
    };
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.strokeStyle = this.color;
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = STROKE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(startCoordinates.x, startCoordinates.y);
    // Save the coordinates in the path.
    this.path.push(startCoordinates.x, startCoordinates.y);
  }

  handleMouseUp(x: number, y: number) {
    if (!this.shouldHandle) {
      return;
    }
    let path = this.path;
    if (path.length === 2) {
      path.push(path[0] - 1);
      path.push(path[1] - 1);
    }

    this.ctx.closePath();

    this.path = [];
    this.shouldHandle = false;

    path = path.map(n => n / this.scaleFactor);
    SocketActions.addEraserDrawing(this.sessionId, this.slideId, this.color, path);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  handleMouseMove(x: number, y: number) {
    if (!this.shouldHandle) {
      return;
    }
    let coordinates = {
      x: Math.round(x),
      y: Math.round(y),
    };

    this.ctx.lineTo(coordinates.x, coordinates.y);
    this.ctx.stroke();
    this.path.push(coordinates.x, coordinates.y);
  }

  handleMouseClick(x: number, y: number) {
    console.debug('EraserHandler ~ MouseClickHandler: this will not be used');
  }
}
