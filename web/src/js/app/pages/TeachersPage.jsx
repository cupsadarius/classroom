/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import UserForm from '../components/users/UserForm.jsx';
import UserActions from '../actions/UserActions.js';
import AttendeeActions from '../actions/AttendeeActions.js';
import {createStore} from '../stores/UserStore.js';
import UsersTable from '../components/users/UsersTable.jsx';
import User from '../models/User.js';

export default class TeachersPage extends BasePage {

  createStore() {
    return createStore('users');
  }

  componentDidMount() {
    AttendeeActions.loadTeachers();
  }

  selectUser(user: User) {
    UserActions.selectUser(user);
  }

  saveUser(user: User) {
    AttendeeActions.saveAttendee(user);
  }

  deleteUser(userId: String) {
    AttendeeActions.deleteAttendee(userId);
  }


  render(): React.Element {
    const teachers = this.state.teachers ? this.state.teachers : [];
    return (
      <div className="row">
        <div className="col-xs-2 sidebar"><Sidebar/></div>
        <div className="col-xs-10 main usersContainer">
          <div className="row">
            <div className="col-xs-8">
              <h3>Teachers Management</h3>
              <UsersTable
                users={teachers}
                selectUser={this.selectUser.bind(this)}
                deleteUser={this.deleteUser.bind(this)}
              />

            </div>
            <div className="col-xs-4">
              <h3>{`${this.state.selectedUser.getId() ? 'Edit' : 'Add new'} teacher`}</h3>
              <UserForm user={this.state.selectedUser} save={this.saveUser.bind(this)} errors={this.state.errors}
                        allowedRoles={['ROLE_STUDENT', 'ROLE_TEACHER']}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}