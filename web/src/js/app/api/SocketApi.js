import * as socket from 'socket.io-client';
import LocalStorage from '../helpers/LocalStorage.js';
import BaseApi, {generateApi} from './BaseApi.js';
import Event, {EVENT_TYPES} from '../models/Event.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
export const SOCKET_BASE_URL = 'http://socket.classroom.dkr';
// export const SOCKET_BASE_URL = 'http://localhost:3000';

class SocketApi extends BaseApi {
  connection: socket.Socket;

  constructor() {
    super();
    this.connection = null;
  }

  connect(sessionId: string) {
    if (this.connection) {
      return true;
    }
    this.connection = socket.connect(SOCKET_BASE_URL);
    this.connection.emit('authentication', {
      sessionId: sessionId,
      participantId: JSON.parse(LocalStorage.get('currentUser')).id,
      token: LocalStorage.get('token'),
    });
    this.connection.on('receive', this.handleReceive.bind(this));
  }

  handleReceive(event: Event) {
    switch (event.type) {
      case EVENT_TYPES.PARTICIPANT_JOIN: {
        event.className = 'ParticipantJoin';
        Dispatcher.dispatch(event);
        break;
      }
      case EVENT_TYPES.CHAT_MESSAGE: {
        event.className = 'ChatMessage';
        Dispatcher.dispatch(event);
        break;
      }
      case EVENT_TYPES.SLIDE_CHANGE: {
        event.className = 'SlideChange';
        Dispatcher.dispatch(event);
        break;
      }
      default: {
        console.warn(`Socket Api: Event type ${event.type} not supported.`);
      }
    }
  }

  emit(event) {
    this.connection.emit('distribute', event);
  }

  disconnect() {
    this.connection.disconnect();
    this.connection = null;
  }

  onSocketConnectEvent(event: {sessionId: string}) {
    this.connect(event.sessionId);
  }

  onSocketEmitEvent(event: {event: Event}) {
    this.emit(event.event);
  }

  onSocketDisconnectEvent() {
    this.disconnect();
  }
}

export let instantiateSocketApi = generateApi(SocketApi);
