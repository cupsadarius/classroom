/* @flow */

import BaseComponent, {React} from './BaseComponent.jsx';
import {Link} from 'react-router';
import {createStore} from '../stores/AuthStore.js';

export default class Sidebar extends BaseComponent {
  createStore() {
    return createStore('auth');
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  render(): React.Component {
    const currentUser = this.getCurrentUser();
    return (
      <div>
        <ul>
          <li><Link to="/home"><i className="fa fa-home"></i> Home</Link></li>
          {currentUser && currentUser.hasRole('ROLE_ADMIN') ?
            <li><Link to="/management/users"><i className="fa fa-user"></i> Users</Link></li> : null}
          {currentUser && currentUser.hasRole('ROLE_ADMIN') ?
            <li><Link to="/management/teachers"><i className="fa fa-user"></i> Teachers</Link></li> : null}
          {currentUser && currentUser.hasRole('ROLE_TEACHER') ?
            <li><Link to="/management/students"><i className="fa fa-user"></i> Students</Link></li> : null}
          {currentUser && currentUser.hasRole('ROLE_TEACHER') ?
            <li><Link to="/management/classrooms"><i className="fa fa-home"></i> Classrooms</Link></li> : null}
          {currentUser && currentUser.hasRole('ROLE_STUDENT') ?
            <li><Link to="/management/sessions"><i className="fa fa-calendar"></i> Sessions</Link></li> : null}
          {currentUser && currentUser.hasRole('ROLE_TEACHER') ?
            <li><Link to="/management/categories"><i className="fa fa-folder-open"></i> Categories</Link></li> : null}
          {currentUser && currentUser.hasRole('ROLE_TEACHER') ?
            <li><Link to="/management/lessons"><i className="fa fa-book"></i> Lessons</Link></li> : null}
        </ul>
      </div>
    );
  }
}
