import Session from '../../models/Session';
import SessionMapping from './mappings/SessionMapping';
import {lessonService} from '../../services/lessonService';

export default class SessionMapper {

  public async hydrate(session: Session, data: SessionMapping) {
    try {
      if (data.id || session.getId()) {
        session.setId(data.id || session.getId());
      }
      session.setStartDate(new Date(data.startDate));
      session.setEndDate(new Date(data.endDate));
      session.setLesson(await lessonService.getById(data.lessonId));
    } catch (e) {
      return e;
    }
    return session;
  }

  public dehydrate(session: Session): SessionMapping {
    const mapping = new SessionMapping();
    mapping.id = session.getId();
    mapping.startDate = session.getStartDate();
    mapping.endDate = session.getEndDate();
    mapping.lessonId = session.getLesson().getId();

    return mapping;
  }
}