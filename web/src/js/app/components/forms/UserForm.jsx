/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import User from '../../models/User.js';

export type UserFormProps = {
  user: User,
  save: (user) => void,
};

export default class UserForm extends BaseComponent {
  props: UserFormProps;

  constructor(props) {
    super(props);
    this.state = {
      user: new User(),
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({user: newProps.user});
  }

  saveUser() {
    this.props.save(this.state.user);
  }

  clearForm() {
    this.setState({user: new User()});
  }

  handleChange(field, event) {
    console.log(field, event.target.value);
    const user = this.state.user;
    user[`${field}`] = event.target.value;
    this.setState({user});
  }

  handleRoleChange(event) {
    const user = this.state.user;
    const newRole = event.target.value;
    const roleLength = user.roles.length;

    user.roles = user.roles.filter(role => role !== newRole);

    if (roleLength === user.roles.length) {
      user.roles.push(newRole);
    }

    this.setState({user});
  }

  render(): React.Component {
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" className="form-control" id="firstName" placeholder="First Name"
                   value={this.state.user.firstName} onChange={this.handleChange.bind(this, 'firstName')} />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                   value={this.state.user.lastName} onChange={this.handleChange.bind(this, 'lastName')} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Email"
                   value={this.state.user.email} onChange={this.handleChange.bind(this, 'email')} />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number"
                   value={this.state.user.phoneNumber} onChange={this.handleChange.bind(this, 'phoneNumber')} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password"
                   value={this.state.user.password} onChange={this.handleChange.bind(this, 'password')} />
          </div>
          <div className="form-group">
            <label htmlFor="roles">Roles</label>
            <select className="form-control" multiple name="roles" id="roles" value={this.state.user.roles}
                    onChange={this.handleRoleChange.bind(this)} >
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Teacher</option>
                <option value="ROLE_ADMIN">Administrator</option>
            </select>
          </div>
          <div className="form-group">
            <button type="button" className="col-xs-5 btn btn-primary" onClick={this.saveUser.bind(this)}>Save</button>
            <button type="button" className="col-xs-5 col-xs-offset-2 btn btn-default" onClick={this.clearForm.bind(this)}>Clear</button>
          </div>
        </form>
      </div>
    );
  }
}