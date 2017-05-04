/* @flow */
import Event, {EVENT_TYPES} from '../models/Event.js';
import User from '../models/User.js';

export class ParticipantJoin extends Event {

  className: string;

  constructor(sessionId: string, participant: User) {
    super(sessionId, null);
    this.className = 'ParticipantJoin';
    this.userId = participant.id;
    this.type = EVENT_TYPES.PARTICIPANT_JOIN;
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
    this.setData({user: `${participant.getFirstName()} ${participant.getLastName()}`, message: message});
  }
}
