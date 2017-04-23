/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {createStore} from '../stores/MultiStore.js';
import {createStore as createClassroomStore} from '../stores/ClassroomStore.js';
import ClassroomActions from '../actions/ClassroomActions.js';
import ClassroomsTable from '../components/home/ClassroomsTable.jsx';
import SessionsTable from '../components/home/SessionsTable.jsx';

export default class HomePage extends BasePage {
  createStore() {
    return createStore({
      classrooms: createClassroomStore('classrooms'),
    });
  }

  componentDidMount() {
    ClassroomActions.loadClassrooms();
  }

  aggregatePastSessions() {
    const pastSessions = [];
    this.state.classrooms.classrooms ? this.state.classrooms.classrooms.forEach(classroom => {
      const pastClassroomSessions = classroom.getPreviousSessions();
      pastClassroomSessions.forEach(session => {
        pastSessions.push({classroom, session});
      });
    }) : null;

    return pastSessions;
  }

  aggregateFutureSessions() {
    const futureSessions = [];
    this.state.classrooms.classrooms ? this.state.classrooms.classrooms.forEach(classroom => {
      const futureClassroomSessions = classroom.getFutureSessions();
      futureClassroomSessions.forEach(session => {
        futureSessions.push({classroom, session});
      });
    }) : null;
    return futureSessions;
  }

  render(): React.Element {
    return (
      <div className="row">
        <div className="col-xs-2 sidebar"><Sidebar/></div>
        <div className="col-xs-10 main">
          <div className="row">
            <div className="col-md-12">
              <h3>Classrooms you teach</h3>
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