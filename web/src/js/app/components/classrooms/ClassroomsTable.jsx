/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import Classroom from '../../models/Classroom.js';

type ClassroomsTableProps = {
  classrooms: Classroom[],
  selectClassroom: (classroom: Classroom) => void,
  deleteClassroom: (classroomId: String) => void,
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
          <td onClick={() => this.props.selectClassroom(classroom)}><i className="fa fa-edit"></i></td>
          <td onClick={() => this.props.deleteClassroom(classroom.getId())}><i className="fa fa-remove"></i></td>
        </tr>
      )
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
          <th colSpan="2" className="text-center text-capitalize">Actions</th>
        </tr>
        </thead>
        <tbody className="tab-content">
        {classroomRows}
        </tbody>
      </table>
    )
  }
}