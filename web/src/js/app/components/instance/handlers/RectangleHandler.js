/* @flow */

import BaseHandler from './BaseHandler.js';
import SocketActions from '../../../actions/SocketActions.js';
const STROKE_WIDTH = 5;

export default class RectangleHandler extends BaseHandler {
  path: Array<number>;
  startCoordinates: {x: number, y: number};
  endCoordinates: {x: number, y: number};
  constructor(ctx: CanvasRenderingContext2D, color: string, scaleFactor: number, sessionId: string, slideId: string, filled: boolean) {
    super(ctx, color, scaleFactor, sessionId, slideId);
    this.path = [];
    this.shouldHandle = false;
    this.filled = filled;
  }

  handleMouseDown(x: number, y: number) {
    this.shouldHandle = true;
    this.startCoordinates = {
      x: Math.round(x),
      y: Math.round(y),
    };

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = STROKE_WIDTH;
  }

  handleMouseUp(x: number, y: number) {
    if (!this.shouldHandle) {
      return;
    }

    let coordinates = {
      fromX: this.startCoordinates.x / this.scaleFactor,
      fromY: this.startCoordinates.y / this.scaleFactor,
      toX: this.endCoordinates.x / this.scaleFactor,
      toY: this.endCoordinates.y / this.scaleFactor,
    };

    this.endDrawing();
    SocketActions.addRectangleDrawing(this.sessionId, this.slideId, this.color, coordinates, this.filled);
  }

  handleMouseMove(x: number, y: number) {
    if (!this.shouldHandle) {
      return;
    }
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    let endCoordinates = {
      x: Math.round(x),
      y: Math.round(y),
    };
    this.endCoordinates = endCoordinates;

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.filled) {
      this.ctx.fillRect(this.startCoordinates.x, this.startCoordinates.y, endCoordinates.x - this.startCoordinates.x, endCoordinates.y - this.startCoordinates.y);
    } else {
      this.ctx.strokeRect(this.startCoordinates.x, this.startCoordinates.y, endCoordinates.x - this.startCoordinates.x, endCoordinates.y - this.startCoordinates.y);
    }
  }

  handleMouseClick(x: number, y: number) {
    console.debug('RectangleHandler ~ MouseClickHandler: this will not be used');
  }

  endDrawing() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.shouldHandle = false;
    this.startCoordinates = null;
    this.endCoordinates = null;
  }
}
