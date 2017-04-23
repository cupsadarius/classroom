/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import Session from '../../models/Session.js';
import Classroom from '../../models/Classroom.js';
import {Link} from 'react-router';
import dateFormatter from '../../helpers/DateFormatter.js';

type ClassroomWithSession = {
  classroom: Classroom,
  session: Session,
}

type SessionsTableProps = {
  sessions: ClassroomWithSession[]
};

export default class SessionsTable extends BaseComponent {
  props: SessionsTableProps;

  getSessionsRows() {
    return this.props.sessions ? this.props.sessions.map((session, index) => {
        return (
          <tr key={session.session.getId()} className="text-center">
            <td>{index + 1}</td>
            <td>{session.classroom.getName()}</td>
            <td>{dateFormatter.formatDate(session.session.getStartDate())}</td>
            <td>{dateFormatter.formatDate(session.session.getEndDate())}</td>
            <td>{session.session.getLesson().getTitle()}</td>
            <td>
              {
                session.session.getEndDate() < new Date() ||
                (session.session.getEndDate() > new Date() && session.session.getStartDate() < new Date()) ?
                  <Link to={`session/${session.session.getId()}`}>Enter</Link> :
                  ''
              }
            </td>
          </tr>
        );
      }) : null;
  }

  render(): React.Element {
    const rows = this.getSessionsRows();
    return (
      <table className="table table-responsive table-striped">
        <thead>
        <tr>
          <th className="text-center text-capitalize">Index</th>
          <th className="text-center text-capitalize">Classroom name</th>
          <th className="text-center text-capitalize">Start Date</th>
          <th className="text-center text-capitalize">End Date</th>
          <th className="text-center text-capitalize">Lesson</th>
          <th className="text-center text-capitalize">Link</th>
        </tr>
        </thead>
        <tbody className="tab-content">
        {rows}
        </tbody>
      </table>
    )
  }
}