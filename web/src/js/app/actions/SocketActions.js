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
  changeSlide(sessionId: string, participant: User, direction: (1 | -1)) {
    this.emit(new socketEvents.SlideChange(sessionId, participant, direction));
  }
}

export default new SocketActions();
