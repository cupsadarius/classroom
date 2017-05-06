/* @flow */

import BaseHandler from './BaseHandler.js';
import SocketActions from '../../../actions/SocketActions.js';
const HIGHLIGHTER_HEIGHT = 20 + 20 * 0.2 - 4;
const HIGHLIGHTER_COLOR = 'rgba(238, 255, 0, 0.5)';

export default class HighlighterHandler extends BaseHandler {
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
      y: Math.round(y - HIGHLIGHTER_HEIGHT * this.scaleFactor / 2),
    };

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = HIGHLIGHTER_COLOR;
    this.ctx.strokeStyle = HIGHLIGHTER_COLOR;
  }

  handleMouseUp(x: number, y: number) {
    if (!this.shouldHandle) {
      return;
    }

    let left = this.endCoordinates.x > this.startCoordinates.x ? this.startCoordinates.x : this.endCoordinates.x;
    let width = Math.abs(this.endCoordinates.x - this.startCoordinates.x);

    let coordinates = {
      fromX: left / this.scaleFactor,
      fromY: this.startCoordinates.y / this.scaleFactor,
      toX: (left + width) / this.scaleFactor,
      toY: this.startCoordinates.y / this.scaleFactor + HIGHLIGHTER_HEIGHT,
    };

    this.endDrawing();
    SocketActions.addHighlighterDrawing(this.sessionId, this.slideId, HIGHLIGHTER_COLOR, coordinates);
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

    this.ctx.fillRect(this.startCoordinates.x, this.startCoordinates.y, endCoordinates.x - this.startCoordinates.x, HIGHLIGHTER_HEIGHT * this.scaleFactor);
  }

  handleMouseClick(x: number, y: number) {
    console.debug('HighlighterHandler ~ MouseClickHandler: this will not be used');
  }

  endDrawing() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.shouldHandle = false;
    this.startCoordinates = null;
    this.endCoordinates = null;
  }
}
