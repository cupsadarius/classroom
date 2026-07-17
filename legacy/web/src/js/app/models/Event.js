/* @flow */

export const EVENT_TYPES = {
  PARTICIPANT_JOIN: 'participant-join',
  CHAT_MESSAGE: 'chat-message',
  SLIDE_CHANGE: 'slide-change',
  PENCIL_DRAWING: 'pencil-drawing',
  LINE_DRAWING: 'line-drawing',
  RECTANGLE_DRAWING: 'rectangle-drawing',
  ERASER_DRAWING: 'eraser-drawing',
  OUTLINE_RECTANGLE_DRAWING: 'outline-rectangle-drawing',
  TEXT_DRAWING: 'text-drawing',
  HIGHLIGHT_DRAWING: 'highlight-drawing',
};

export const PERSISTENCE_LEVEL = {
  NONE: 0,
  EPHEMERAL: 1,
  PERSISTENT: 2,
};

export default class Event {
  sessionId: string;
  slideId: ?string;
  userId: string;
  revision: number;
  type: string;
  data: {[key: string]: any};
  className: ?string;
  persistenceLevel: (0 | 1 | 2);

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

  getPersistenceLevel() {
    return this.persistenceLevel;
  }

  setPersistenceLevel(persistenceLevel: (0 | 1 | 2)) {
    this.persistenceLevel = persistenceLevel;
  }
}
