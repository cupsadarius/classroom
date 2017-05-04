/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import User from '../../models/User.js';
import cx from 'classnames';
import MD5 from '../../helpers/MD5.js';
export type AttendeesProps = {
  attendees: User[]
}

export default class Attendees extends BaseComponent {
  props: AttendeesProps;

  getAttendeeRows() {
    return this.props.attendees ? this.props.attendees.map((attendee: User) => {
      return (
        <div key={attendee.id} className="attendee">
          <div className="image">
            <img className="profileImage img-responsive" src={`https://www.gravatar.com/avatar/${MD5.hash(attendee.getEmail())}`}/>
          </div>
          <div className="name">
            <strong>{`${attendee.getFirstName()} ${attendee.getLastName()}`}</strong>
          </div>
        </div>
      );
    }) : null;
  }

  render(): React.Element {
    const isSingle = this.props.attendees && this.props.attendees.length === 1;
    return (
      <div className={cx('attendees', {'isSingle': isSingle, 'multiple': !isSingle})}>
        {this.getAttendeeRows()}
      </div>
    );
  }
}
