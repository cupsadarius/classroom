/* @flow */

import BaseAction from './BaseAction.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

import * as socketEvents from '../events/SocketEvents.js';

export class SocketActions extends BaseAction {
  connect(sessionId: string) {
    this.trigger({className: 'SocketConnectEvent', sessionId: sessionId});
  }
  emit(event: Event) {
    this.trigger({className: 'SocketEmitEvent', event: event});
  }
  disconnect() {
    this.trigger({className: 'SocketDisconnectEvent'});
  }
  participantJoined(sessionId: string, participant: User) {
    this.emit(new socketEvents.ParticipantJoin(sessionId, participant));
  }
  sendChatMessage(sessionId: string, participant: User, message: string) {
    this.emit(new socketEvents.ChatMessage(sessionId, participant, message));
  }
  changeSlide(sessionId: string, direction: (1 | -1)) {
    this.emit(new socketEvents.SlideChange(sessionId, direction));
  }
  addPencilDrawing(sessionId: string, slideId: string, color: string, path: Array<number>) {
    this.emit(new socketEvents.PencilDrawing(sessionId, slideId, color, path));
  }
  addEraserDrawing(sessionId: string, slideId: string, color: string, path: Array<number>) {
    this.emit(new socketEvents.EraserDrawing(sessionId, slideId, color, path));
  }
  addLineDrawing(sessionId: string, slideId: string, color: string, coordinates: {fromX: number, fromY: number, toX: number, toY: number}) {
    this.emit(new socketEvents.LineDrawing(sessionId, slideId, color, coordinates));
  }
  addRectangleDrawing(sessionId: string, slideId: string, color: string, coordinates: {fromX: number, fromY: number, toX: number, toY: number}, filled: boolean) {
    this.emit(new socketEvents.RectangleDrawing(sessionId, slideId, color, coordinates, filled));
  }
  addHighlighterDrawing(sessionId: string, slideId: string, color: string, coordinates: {fromX: number, fromY: number, toX: number, toY: number}) {
    this.emit(new socketEvents.HighlighterDrawing(sessionId, slideId, color, coordinates));
  }
}

export default new SocketActions();
