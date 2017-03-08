import Classroom from '../../models/Classroom';
import ClassroomMapping from './mappings/ClassroomMapping';
import {attendeeService} from '../../services/attendeeService';

export default class ClassroomMapper {
  public async hydrate(classroom: Classroom, data: ClassroomMapping) {
    try {
      if (data.id || classroom.getId()) {
        classroom.setId(data.id || classroom.getId());
      }
      classroom.setName(data.name);
      classroom.setLastSessionId(data.lastSessionId);
      classroom.setStudents(await attendeeService.getByIds(data.students));
      classroom.setTeachers(await attendeeService.getByIds(data.teachers));
      // classroom.setSessions(await sessionServie.getByIds(data.sessions));
    } catch (e) {
      return e;
    }

    return classroom;
  }

  public dehydrate(classroom: Classroom): ClassroomMapping {
    const mapping = new ClassroomMapping();
    mapping.id = classroom.getId();
    mapping.name = classroom.getName();
    mapping.students = classroom.getStudents().map(student => student.getId());
    mapping.teachers = classroom.getTeachers().map(teacher => teacher.getId());
    mapping.sessions = classroom.getSessions().map(session => session.getId());
    mapping.lastSessionId = classroom.getLastSessionId();

    return mapping;
  }
 }