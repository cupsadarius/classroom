import * as socket from 'socket.io-client';
import LocalStorage from '../helpers/LocalStorage.js';
import BaseApi, {generateApi} from './BaseApi.js';
import Event from '../models/Event.js';
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

  handleReceive(event) {
    console.log(event);
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
