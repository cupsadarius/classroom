/* @flow */

import BaseComponent, {React} from './BaseComponent.jsx';
import {Link} from 'react-router';
import LocalStorage from '../helpers/LocalStorage.js';
import User from '../models/User.js';

export default class Sidebar extends BaseComponent {
  getCurrentUser() {
    return LocalStorage.get('currentUser') ? new User(JSON.parse(LocalStorage.get('currentUser'))) : null;
  }

  render(): React.Component {
    const currentUser = this.getCurrentUser();
    return (
        <div>
          <ul>
            <li><Link to="/home"><i className="fa fa-home"></i> Home</Link></li>
            {currentUser && currentUser.hasRole('ROLE_ADMIN') ? <li><Link to="/users"><i className="fa fa-user"></i> Users</Link></li> : null }
            {currentUser && currentUser.hasRole('ROLE_TEACHER') ? <li><Link to="/lessons"><i className="fa fa-book"></i> Lessons</Link></li> : null }
            <li><Link to="/sessions"><i className="fa fa-clock-o"></i> Sessions</Link></li>
          </ul>
        </div>
      );
  }
}