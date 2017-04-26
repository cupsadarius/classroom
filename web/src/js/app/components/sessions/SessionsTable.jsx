/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import Session from '../../models/Session.js';
import dateFormatter from '../../helpers/DateFormatter.js';

type SessionsTableProps = {
  sessions: Session[],
  selectSession: (session: Session) => void,
  deleteSession: (sessionId: string) => void,
};

export default class SessionsTable extends BaseComponent {
  props: SessionsTableProps;

  getSessionsRows() {
    return this.props.sessions ? this.props.sessions.map((session, index) => {
      return (
        <tr key={session.getId()} className="text-center">
          <td>{index + 1}</td>
          <td>{dateFormatter.formatDate(session.getStartDate())}</td>
          <td>{dateFormatter.formatDate(session.getEndDate())}</td>
          <td>{session.getLesson().getTitle()}</td>
          <td onClick={() => this.props.selectSession(session)}><i className="fa fa-edit"></i></td>
          <td onClick={() => this.props.deleteSession(session.getId())}><i className="fa fa-remove"></i></td>
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
          <th className="text-center text-capitalize">Start Date</th>
          <th className="text-center text-capitalize">End Date</th>
          <th className="text-center text-capitalize">Lesson</th>
          <th colSpan="2" className="text-center text-capitalize">Actions</th>
        </tr>
        </thead>
        <tbody className="tab-content">
        {rows}
        </tbody>
      </table>
    );
  }
}
