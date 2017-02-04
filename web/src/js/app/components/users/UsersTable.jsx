/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import MD5 from '../../helpers/MD5.js';
import User from '../../models/User.js';

type UserTableProps = {
  users: User[],
  selectUser: (user: User) => void,
  deleteUser: (userId: String) => void,
};

export default class UsersTable extends BaseComponent {
  props: UserTableProps;

  getUserRows() {
    return this.props.users ? this.props.users.map((user, index) => {
      return (
        <tr key={user.getId()} className="text-center">
          <td>{index + 1}</td>
          <td><img className="img-responsive img-circle"
                   src={`https://www.gravatar.com/avatar/${MD5.hash(user.getEmail())}`}/></td>
          <td>{`${user.getFirstName()} ${user.getLastName()}`}</td>
          <td>{user.getEmail()}</td>
          <td onClick={() => this.props.selectUser(user)}><i className="fa fa-edit"></i></td>
          <td onClick={() => this.props.deleteUser(user.getId())}><i className="fa fa-remove"></i></td>
        </tr>
      )
      }) : null;
  }

  render(): React.Element {
    const userRows = this.getUserRows();
    return (
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
    )
  }
}