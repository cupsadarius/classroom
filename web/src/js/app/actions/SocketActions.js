/* @flow */

import BaseAction from './BaseAction.js';
import Event from '../models/Event.js';

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
}

export default new SocketActions();
