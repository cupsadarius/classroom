/* @flow */
import Event, {EVENT_TYPES, PERSISTENCE_LEVEL} from '../models/Event.js';
import User from '../models/User.js';

export class ParticipantJoin extends Event {

  className: string;

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

  className: string;

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

  className: string;

  constructor(sessionId: string, participant: User, direction: (1 | -1)) {
    super(sessionId, null);
    this.className = 'SlideChange';
    this.userId = participant.id;
    this.type = EVENT_TYPES.SLIDE_CHANGE;
    this.persistenceLevel = PERSISTENCE_LEVEL.EPHEMERAL;
    this.setData({direction});
  }
}
