/* @flow */

export default class BaseHandler {

  ctx: CanvasRenderingContext2D;
  shouldHandle: boolean;
  color: string;
  scaleFactor: number;
  sessionId: string;
  slideId: string;
  constructor(ctx: CanvasRenderingContext2D, color: string, scaleFactor: number, sessionId: string, slideId: string) {
    if (!ctx) {
      throw new Error('BaseHandler: Missing required constructor argument "ctx"');
    }
    if (!color) {
      throw new Error('BaseHandler: Missing required constructor argument "color"');
    }
    if (!scaleFactor) {
      throw new Error('BaseHandler: Missing required constructor argument "scaleFactor"');
    }
    if (!sessionId) {
      throw new Error('BaseHandler: Missing required constructor argument "sessionId"');
    }
    if (!slideId) {
      throw new Error('BaseHandler: Missing required constructor argument "slideId"');
    }
    this.update(ctx, color, scaleFactor, sessionId, slideId);
    this.shouldHandle = false;
  }

  update(ctx: CanvasRenderingContext2D, color: string, scaleFactor: number, sessionId: string, slideId: string) {
    this.ctx = ctx;
    this.color = color;
    this.scaleFactor = scaleFactor;
    this.sessionId = sessionId;
    this.slideId = slideId;
  }

  handleMouseDown(x: number, y: number) {}

  handleMouseUp(x: number, y: number) {}

  handleMouseMove(x: number, y: number) {}

  handleMouseClick(x: number, y: number) {}
}
