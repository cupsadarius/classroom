/* @flow */
import Event from '../models/Event.js';
import User from '../models/User.js';

export class ParticipantJoin extends Event {
  constructor(sessionId: string, slideId: string, participant: User) {
    super(sessionId, slideId);
    this.setData({participant});
  }
}
