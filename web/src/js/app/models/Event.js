/* @flow */

export const EVENT_TYPES = {
  PARTICIPANT_JOIN: 'participant-join',
  CHAT_MESSAGE: 'chat-message',
};

export default class Event {
  sessionId: string;
  slideId: ?string;
  userId: string;
  revision: number;
  type: string;
  data: {[key: string]: any};
  className: ?string;

  constructor(sessionId: string, slideId: ?string) {
    this.sessionId = sessionId;
    this.slideId = slideId;
  }

  getSessionId() {
    return this.sessionId;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  getSlideId() {
    return this.slideId;
  }

  setSlideId(slideId: string) {
    this.slideId = slideId;
  }

  getUserId() {
    return this.userId;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getRevision() {
    return this.revision;
  }

  setRevision(revision: number) {
    this.revision = revision;
  }

  getType() {
    return this.type;
  }

  setType(type: string) {
    this.type = type;
  }

  getData() {
    return this.data;
  }

  setData(data: {[key: string]: any}) {
    this.data = data;
  }
}
