import Session from '../../models/Session';
import SessionMapping from './mappings/SessionMapping';
import {lessonService} from '../../services/lessonService';
import * as uuid from 'uuid';

export default class SessionMapper {

  public async hydrate(session: Session, data: SessionMapping): Promise<Session> {
    try {
      if (data.id || session.getId()) {
        session.setId(data.id || session.getId());
      }
      session.setStartDate(new Date(data.startDate ? data.startDate : session.getStartDate()));
      session.setEndDate(new Date(data.endDate ? data.endDate : session.getEndDate()));
      session.setLesson(data.lessonId ? await lessonService.getById(data.lessonId) : session.getLesson());
    } catch (e) {
      return e;
    }
    return session;
  }

  public dehydrate(session: Session): SessionMapping {
    const mapping = new SessionMapping();
    mapping.id = session.getId() ? session.getId() : uuid.v4();
    mapping.startDate = session.getStartDate();
    mapping.endDate = session.getEndDate();
    mapping.lessonId = session.getLesson().getId();

    return mapping;
  }
}