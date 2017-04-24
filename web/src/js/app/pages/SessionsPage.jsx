/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {createStore} from '../stores/MultiStore.js';
import {createStore as createClassroomStore} from '../stores/ClassroomStore.js';
import {createStore as createSessionsStore} from '../stores/SessionStore.js';
import {createStore as createLessonsStore} from '../stores/LessonStore.js';
import {createStore as createCategoryStore} from '../stores/CategoryStore.js';
import SessionActions from '../actions/SessionActions.js';
import ClassroomActions from '../actions/ClassroomActions.js';
import LessonActions from '../actions/LessonActions.js';
import CategoriesActions from '../actions/CategoriesActions.js';
import SessionsTable from '../components/sessions/SessionsTable.jsx';
import SessionForm from '../components/sessions/SessionForm.jsx';
import Session from '../models/Session.js';

export default class SessionsPage extends BasePage {
  createStore() {
    return createStore({
      classrooms: createClassroomStore('classrooms'),
      sessions: createSessionsStore('sessions'),
      categories: createCategoryStore('categories'),
      lessons: createLessonsStore('lessons'),
    });
  }

  componentDidMount() {
    ClassroomActions.loadClassrooms();
    CategoriesActions.loadCategories();
    LessonActions.loadLessons();
  }

  handleClassroomChange(event: Object) {
    const selectedClassroom = this.state.classrooms.classrooms ? this.state.classrooms.classrooms.filter(classroom => classroom.getId() === event.target.value).pop() : null;

    if (selectedClassroom) {
      ClassroomActions.selectClassroom(selectedClassroom);
      SessionActions.loadSessions(selectedClassroom.getSessions());
    }
  }

  getClassroomRows() {
    return this.state.classrooms.classrooms ? this.state.classrooms.classrooms.map(classroom => {
      return <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
    }) : null;
  }

  selectSession(session: Session) {
    SessionActions.selectSession(session);
  }

  deleteSession(sessionId: string) {
    SessionActions.deleteSession(this.state.classrooms.selectedClassroom.getId(), sessionId);
  }

  saveSession(session: Session) {
    SessionActions.saveSession(this.state.classrooms.selectedClassroom, session);
  }

  render(): React.Element {
    return (
      <div className="row">
        <div className="col-xs-2 sidebar"><Sidebar/></div>
        <div className="col-xs-10 main sessionsContainer">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <h3>Select classroom</h3>
                <select className="form-control" id="classroom"
                        value={this.state.classrooms.selectedClassroom ? this.state.classrooms.selectedClassroom.getId() : ''}
                        onChange={this.handleClassroomChange.bind(this)}>
                        <optgroup label="Classrooms">
                        {this.getClassroomRows()}
                        </optgroup>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-8">
              <h3>Session Management</h3>
              <SessionsTable
                sessions={this.state.sessions.sessions}
                selectSession={this.selectSession.bind(this)}
                deleteSession={this.deleteSession.bind(this)}
              />
            </div>
            <div className="col-xs-4">
              <h3>{`${this.state.sessions.selectedSession.id ? 'Edit' : 'Add new'} session`}</h3>
              <SessionForm
                session={this.state.sessions.selectedSession}
                lessons={this.state.lessons.lessons}
                categories={this.state.categories.categories}
                errors={this.state.sessions.errors}
                save={this.saveSession.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
