/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import UserForm from '../components/forms/UserForm.jsx';
import UserActions from '../actions/UserActions.js';
import {createStore} from '../stores/UserStore.js';
import MD5 from '../helpers/MD5.js';

export default class UsersPage extends BasePage {

  createStore() {
    return createStore('users');
  }

  componentDidMount() {
    UserActions.loadUsers();
  }

  getUserRows() {
    return this.state.users ? this.state.users.map((user, index) => {
      return (
        <tr key={user.getId()} className="text-center">
          <td>{index + 1}</td>
          <td><img className="img-responsive img-circle" src={`https://www.gravatar.com/avatar/${MD5.hash(user.getEmail())}`} /></td>
          <td>{`${user.getFirstName()} ${user.getLastName()}`}</td>
          <td>{user.getEmail()}</td>
          <td><i className="fa fa-edit"></i></td>
          <td><i className="fa fa-remove"></i></td>
        </tr>
      )
    }) : null;
  }

  render(): React.Element {
    const userRows = this.getUserRows();

    return (
      <div className="row">
        <div className="col-xs-2 sidebar"><Sidebar/></div>
        <div className="col-xs-10 main usersContainer">
          <div className="row">
            <div className="col-xs-8">
              <h3>User Management</h3>
              <table className="table table-responsive table-striped">
                <thead>
                  <tr>
                    <th className="text-center text-capitalize">Index</th>
                    <th className="text-center text-capitalize">Photo</th>
                    <th className="text-center text-capitalize">Name</th>
                    <th className="text-center text-capitalize">Email</th>
                    <th colSpan="2" className="text-center text-capitalize">Actions</th>
                  </tr>
                </thead>
                <tbody className="tab-content">
                  {userRows}
                </tbody>
              </table>
            </div>
            <div className="col-xs-4">
              <h3>{`${this.state.selectedUser ? 'Edit' : 'Add new'} user`}</h3>
              <UserForm user={this.state.selectedUser} save={user => {console.log('save user', user)}} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}