/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import Teacher from '../../models/Teacher.js';
import Student from '../../models/Student.js';
import Classroom from '../../models/Classroom.js';

export type ClassroomFormProps = {
  classroom: Classroom,
  save: (classroom: Classroom) => void,
  teachers: Teacher[],
  students: Student[],
  errors: ?string,
};

export default class ClassroomForm extends BaseComponent {
  props: ClassroomFormProps;

  constructor(props: ClassroomFormProps) {
    super(props);
    this.state = {
      classroom: new Classroom(),
    };
  }

  componentWillReceiveProps(newProps: ClassroomFormProps) {
    this.setState({classroom: newProps.classroom});
  }

  saveClassroom() {
    this.props.save(this.state.classroom);
  }

  clearForm() {
    this.setState({classroom: new Classroom()});
  }

  handleChange(field: string, event: Object) {
    const classroom = this.state.classroom;
    classroom[`${field}`] = event.target.value;
    this.setState({classroom});
  }

  handleTeacherChange(event: Object) {
    const classroom = this.state.classroom;
    const newAttendeeId = event.target.value;
    const attendeeLength = classroom.teachers.length;

    classroom.teachers = classroom.teachers.filter(attendee => attendee.id !== newAttendeeId);

    if (attendeeLength === classroom.teachers.length && this.props.teachers) {
      classroom.teachers.push(this.props.teachers.filter(attendee => attendee.id === newAttendeeId).pop());
    }

    this.setState({classroom});
  }

  handleStudentChange(event: Object) {
    const classroom = this.state.classroom;
    const newAttendeeId = event.target.value;
    const attendeeLength = classroom.students.length;

    classroom.students = classroom.students.filter(attendee => attendee.id !== newAttendeeId);

    if (attendeeLength === classroom.students.length && this.props.students) {
      classroom.students.push(this.props.students.filter(attendee => attendee.id === newAttendeeId).pop());
    }

    this.setState({classroom});
  }

  getAttendeeRowsByType(type: string) {
    return this.props[type] ? this.props[type].map((attendee, index) => <option key={index}
                                                                                value={attendee.id}>{attendee.firstName} {attendee.lastName}</option>) : null;
  }

  render(): React.Component {
    return (
      <div className="classroomForm">
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Name"
                   value={this.state.classroom.name} onChange={this.handleChange.bind(this, 'name')}/>
          </div>
          <div className="form-group">
            <label htmlFor="teachers">Teachers</label>
            <select className="form-control" multiple name="teachers" id="teachers"
                    value={this.state.classroom.teachers ? this.state.classroom.teachers.map(teacher => teacher.id) : []}
                    onChange={this.handleTeacherChange.bind(this)}
            >
              {this.getAttendeeRowsByType('teachers')}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="students">Students</label>
            <select className="form-control" multiple name="students" id="students"
                    value={this.state.classroom.students ? this.state.classroom.students.map(students => students.id) : []}
                    onChange={this.handleStudentChange.bind(this)}
            >
              {this.getAttendeeRowsByType('students')}
            </select>
          </div>
          <div className="form-group">
            <button type="button" className="col-xs-5 btn btn-primary" onClick={this.saveClassroom.bind(this)}>Save
            </button>
            <button type="button" className="col-xs-5 col-xs-offset-2 btn btn-default"
                    onClick={this.clearForm.bind(this)}>Clear
            </button>
          </div>
        </form>
        <div className="clearfix"></div>
        <div className="errors">
          {this.props.errors}
        </div>
      </div>
    );
  }
}
