import Classroom from '../../models/Classroom';
import ClassroomMapping from './mappings/ClassroomMapping';
import {attendeeService} from '../../services/attendeeService';
import {sessionService} from '../../services/sessionService';
import * as uuid from 'uuid';

export default class ClassroomMapper {
  public async hydrate(classroom: Classroom, data: ClassroomMapping) {
    try {
      if (data.id || classroom.getId()) {
        classroom.setId(data.id || classroom.getId());
      }
      classroom.setName(data.name || classroom.getName());
      classroom.setLastSessionId(data.lastSessionId || classroom.getLastSessionId());
      await classroom.setStudents(data.students && data.students.length ? await attendeeService.getByIds(data.students) : classroom.getStudents());
      await classroom.setTeachers(data.teachers && data.teachers.length ? await attendeeService.getByIds(data.teachers) : classroom.getTeachers());
      await classroom.setSessions(data.sessions && data.sessions.length ? await sessionService.getByIds(data.sessions) : classroom.getSessions());
    } catch (e) {
      return e;
    }

    return classroom;
  }

  public dehydrate(classroom: Classroom): ClassroomMapping {
    const mapping = new ClassroomMapping();
    mapping.id = classroom.getId() ? classroom.getId() : uuid.v4();
    mapping.name = classroom.getName();
    mapping.students = classroom.getStudents().map(student => student.getId());
    mapping.teachers = classroom.getTeachers().map(teacher => teacher.getId());
    mapping.sessions = classroom.getSessions().map(session => session.getId());
    mapping.lastSessionId = classroom.getLastSessionId();

    return mapping;
  }
 }