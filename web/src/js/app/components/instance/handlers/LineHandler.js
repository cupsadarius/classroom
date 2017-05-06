/* @flow */

import BaseHandler from './BaseHandler.js';
import SocketActions from '../../../actions/SocketActions.js';
const STROKE_WIDTH = 5;

export default class LineHandler extends BaseHandler {
  path: Array<number>;
  startCoordinates: {x: number, y: number};
  endCoordinates: {x: number, y: number};
  constructor(ctx: CanvasRenderingContext2D, color: string, scaleFactor: number, sessionId: string, slideId: string) {
    super(ctx, color, scaleFactor, sessionId, slideId);
    this.path = [];
    this.shouldHandle = false;
  }

  handleMouseDown(x: number, y: number) {
    this.shouldHandle = true;
    this.startCoordinates = {
      x: Math.round(x),
      y: Math.round(y),
    };

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = this.color;
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
    SocketActions.addLineDrawing(this.sessionId, this.slideId, this.color, coordinates);
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

    if (this.ctx.setLineDash) {
      this.ctx.setLineDash([5, 15]);
    }
    this.ctx.beginPath();
    this.ctx.moveTo(this.startCoordinates.x, this.startCoordinates.y);
    this.ctx.lineTo(endCoordinates.x, endCoordinates.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  handleMouseClick(x: number, y: number) {
    console.debug('LineHandler ~ MouseClickHandler: this will not be used');
  }

  endDrawing() {
    if (this.ctx.setLineDash) {
      this.ctx.setLineDash([]);
    }

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.shouldHandle = false;
    this.startCoordinates = null;
    this.endCoordinates = null;
  }
}
