/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {createStore} from '../stores/MultiStore.js';
import {createStore as createClassroomStore} from '../stores/ClassroomStore.js';
import {createStore as createUserStore} from '../stores/UserStore.js';
import AttendeeActions from '../actions/AttendeeActions.js';
import ClassroomActions from '../actions/ClassroomActions.js';
import ClassroomsTable from '../components/classrooms/ClassroomsTable.jsx';
import ClassroomForm from '../components/classrooms/ClassroomForm.jsx';
import Classroom from '../models/Classroom.js';
export default class ClassroomsPage extends BasePage {
  createStore() {
    return createStore({
      classrooms: createClassroomStore('classrooms'),
      attendees: createUserStore('users'),
    });
  }

  componentDidMount() {
    AttendeeActions.loadTeachers();
    AttendeeActions.loadStudents();
    ClassroomActions.loadClassrooms();
  }

  selectClassroom(classroom: Classroom) {
    ClassroomActions.selectClassroom(classroom);
  }

  deleteClassroom(classroomId: string) {
    ClassroomActions.deleteClassroom(classroomId);
  }

  saveClassroom(classroom: Classroom) {
    ClassroomActions.saveClassroom(classroom);
  }

  render(): React.Element {
    return (
      <div className="row">
        <div className="col-xs-2 sidebar"><Sidebar/></div>
        <div className="col-xs-10 main classroomsContainer">
          <div className="row">
            <div className="col-xs-8">
              <h3>Classroom Management</h3>
              <ClassroomsTable
                classrooms={this.state.classrooms.classrooms}
                selectClassroom={this.selectClassroom.bind(this)}
                deleteClassroom={this.deleteClassroom.bind(this)}
              />
            </div>
            <div className="col-xs-4">
              <h3>{`${this.state.classrooms.selectedClassroom.id ? 'Edit' : 'Add new'} classroom`}</h3>
              <ClassroomForm
                classroom={this.state.classrooms.selectedClassroom}
                teachers={this.state.attendees.teachers}
                students={this.state.attendees.students}
                save={this.saveClassroom.bind(this)}
                errors={this.state.classrooms.errors}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
