/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {createStore} from '../stores/MultiStore.js';
import {createStore as createClassroomStore} from '../stores/ClassroomStore.js';
import {createStore as createAuthStore} from '../stores/AuthStore.js';
import ClassroomActions from '../actions/ClassroomActions.js';
import ClassroomsTable from '../components/home/ClassroomsTable.jsx';
import SessionsTable from '../components/home/SessionsTable.jsx';
import cx from 'classnames';
export default class HomePage extends BasePage {
  createStore() {
    return createStore({
      classrooms: createClassroomStore('classrooms'),
      auth: createAuthStore('auth'),
    });
  }

  componentDidMount() {
    ClassroomActions.loadClassrooms();
  }

  getCurrentUser() {
    return this.state.auth.currentUser;
  }

  aggregatePastSessions() {
    const pastSessions = [];
    if (this.state.classrooms.classrooms) {
      this.state.classrooms.classrooms.forEach(classroom => {
        const pastClassroomSessions = classroom.getPreviousSessions();
        pastClassroomSessions.forEach(session => {
          pastSessions.push({classroom, session});
        });
      });
    }

    return pastSessions.sort((a, b) => {
      if (a.session.startDate === b.session.startDate) {
        return 1;
      }
      return a.session.startDate < b.session.startDate ? -1 : 1;
    }).sort((a, b) => {
      if (a.session.endDate === b.session.endDate) {
        return 1;
      }
      return a.session.endDate < b.session.endDate ? -1 : 1;
    });
  }

  aggregateFutureSessions() {
    const futureSessions = [];
    if (this.state.classrooms.classrooms) {
      this.state.classrooms.classrooms.forEach(classroom => {
        const futureClassroomSessions = classroom.getFutureSessions();
        futureClassroomSessions.forEach(session => {
          futureSessions.push({classroom, session});
        });
      });
    }
    return futureSessions.sort((a, b) => {
      if (a.session.startDate === b.session.startDate) {
        return 1;
      }
      return a.session.startDate < b.session.startDate ? -1 : 1;
    }).sort((a, b) => {
      if (a.session.endDate === b.session.endDate) {
        return 1;
      }
      return a.session.endDate < b.session.endDate ? -1 : 1;
    });
  }

  render(): React.Element {
    const isTeacher = this.getCurrentUser() ? this.getCurrentUser().hasRole('ROLE_TEACHER') : false;
    return (
      <div className="row">
        {isTeacher ? <div className="col-md-2 sidebar"><Sidebar/></div> : null}
        <div className={cx({'col-md-10 main': isTeacher, 'col-md-12': !isTeacher})}>
          <div className="row">
            <div className="col-md-12">
              <h3>Classrooms you {isTeacher ? 'teach' : 'are part of'}</h3>
              <ClassroomsTable classrooms={this.state.classrooms.classrooms} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h3>Past Sessions</h3>
              <SessionsTable sessions={this.aggregatePastSessions()} />
            </div>
            <div className="col-md-6">
              <h3>Future Sessions</h3>
              <SessionsTable sessions={this.aggregateFutureSessions()} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
