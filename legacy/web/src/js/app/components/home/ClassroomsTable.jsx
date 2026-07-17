/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import Classroom from '../../models/Classroom.js';
import dateFormatter from '../../helpers/DateFormatter.js';

type ClassroomsTableProps = {
  classrooms: Classroom[]
};

export default class ClassroomsTable extends BaseComponent {
  props: ClassroomsTableProps;

  getClassroomRows() {
    return this.props.classrooms ? this.props.classrooms.map((classroom, index) => {
      return (
        <tr key={classroom.getId()} className="text-center">
          <td>{index + 1}</td>
          <td>{classroom.getName()}</td>
          <td>{classroom.getTeachers().map(teacher => <div key={teacher.id}>{teacher.firstName} {teacher.lastName}</div>)}</td>
          <td>{classroom.getStudents().map(student => <div key={student.id}>{student.firstName} {student.lastName}</div>)}</td>
          <td>{classroom.getSessions().length}</td>
          <td>{classroom.getLastSession() ? dateFormatter.formatDate(classroom.getLastSession().getStartDate()) : ''}</td>
          <td>{classroom.getLastSession() ? classroom.getLastSession().getLesson().getTitle() : ''}</td>
        </tr>
      );
    }) : null;
  }

  render(): React.Element {
    const classroomRows = this.getClassroomRows();
    return (
      <table className="table table-responsive table-striped">
        <thead>
          <tr>
            <th className="text-center text-capitalize">Index</th>
            <th className="text-center text-capitalize">Name</th>
            <th className="text-center text-capitalize">Teachers</th>
            <th className="text-center text-capitalize">Students</th>
            <th className="text-center text-capitalize">No sessions</th>
            <th className="text-center text-capitalize">Last session on</th>
            <th className="text-center text-capitalize">Last lesson</th>
          </tr>
        </thead>
        <tbody className="tab-content">
        {classroomRows}
        </tbody>
      </table>
    );
  }
}
