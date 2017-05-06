/* @flow */
import Event, {EVENT_TYPES, PERSISTENCE_LEVEL} from '../models/Event.js';
import User from '../models/User.js';

export class ParticipantJoin extends Event {
  constructor(sessionId: string, participant: User) {
    super(sessionId, null);
    this.className = 'ParticipantJoin';
    this.userId = participant.id;
    this.type = EVENT_TYPES.PARTICIPANT_JOIN;
    this.persistenceLevel = PERSISTENCE_LEVEL.EPHEMERAL;
    this.setData({participant});
  }
}

export class ChatMessage extends Event {
  constructor(sessionId: string, participant: User, message: string) {
    super(sessionId, null);
    this.className = 'ChatMessage';
    this.userId = participant.id;
    this.type = EVENT_TYPES.CHAT_MESSAGE;
    this.persistenceLevel = PERSISTENCE_LEVEL.PERSISTENT;
    this.setData({user: `${participant.getFirstName()} ${participant.getLastName()}`, message: message});
  }
}

export class SlideChange extends Event {
  constructor(sessionId: string, direction: (1 | -1)) {
    super(sessionId, null);
    this.className = 'SlideChange';
    this.type = EVENT_TYPES.SLIDE_CHANGE;
    this.persistenceLevel = PERSISTENCE_LEVEL.EPHEMERAL;
    this.setData({direction});
  }
}

export class PencilDrawing extends Event {
  constructor(sessionId: string, slideId: string, color: string, path: Array<number>) {
    super(sessionId, slideId);
    this.className = 'PencilDrawing';
    this.type = EVENT_TYPES.PENCIL_DRAWING;
    this.persistenceLevel = PERSISTENCE_LEVEL.PERSISTENT;
    this.setData({color, path});
  }
}

export class EraserDrawing extends Event {
  constructor(sessionId: string, slideId: string, color: string, path: Array<number>) {
    super(sessionId, slideId);
    this.className = 'EraserDrawing';
    this.type = EVENT_TYPES.ERASER_DRAWING;
    this.persistenceLevel = PERSISTENCE_LEVEL.PERSISTENT;
    this.setData({color, path});
  }
}

export class LineDrawing extends Event {
  constructor(sessionId: string, slideId: string, color: string, coordinates: {fromX: number, fromY: number, toX: number, toY: number}) {
    super(sessionId, slideId);
    this.className = 'LineDrawing';
    this.type = EVENT_TYPES.LINE_DRAWING;
    this.persistenceLevel = PERSISTENCE_LEVEL.PERSISTENT;
    this.setData({color, coordinates});
  }
}

export class RectangleDrawing extends Event {
  constructor(sessionId: string, slideId: string, color: string, coordinates: {fromX: number, fromY: number, toX: number, toY: number}, filled: boolean) {
    super(sessionId, slideId);
    this.className = filled ? 'RectangleDrawing' : 'OutlineRectangleDrawing';
    this.type = filled ? EVENT_TYPES.RECTANGLE_DRAWING : EVENT_TYPES.OUTLINE_RECTANGLE_DRAWING;
    this.persistenceLevel = PERSISTENCE_LEVEL.PERSISTENT;
    this.setData({color, coordinates, filled});
  }
}

export class HighlighterDrawing extends Event {
  constructor(sessionId: string, slideId: string, color: string, coordinates: {fromX: number, fromY: number, toX: number, toY: number}) {
    super(sessionId, slideId);
    this.className = 'HighlighterDrawing';
    this.type = EVENT_TYPES.HIGHLIGHT_DRAWING;
    this.persistenceLevel = PERSISTENCE_LEVEL.PERSISTENT;
    this.setData({color, coordinates});
  }
}
