/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import User from '../../models/User.js';

export type UserFormProps = {
  user: User,
  save: (user: User) => void,
  errors: ?string,
  allowedRoles: string[],
};

export default class UserForm extends BaseComponent {
  props: UserFormProps;

  constructor(props: UserFormProps) {
    super(props);
    this.state = {
      user: new User(),
    };
  }

  componentWillReceiveProps(newProps: UserFormProps) {
    this.setState({user: newProps.user});
  }

  saveUser() {
    this.props.save(this.state.user);
  }

  clearForm() {
    this.setState({user: new User()});
  }

  handleChange(field: string, event: Object) {
    const user = this.state.user;
    user[`${field}`] = event.target.value;
    this.setState({user});
  }

  handleRoleChange(event: Object) {
    const user = this.state.user;
    const newRole = event.target.value;
    const roleLength = user.roles.length;

    user.roles = user.roles.filter(role => role !== newRole);

    if (roleLength === user.roles.length) {
      user.roles.push(newRole);
    }

    this.setState({user});
  }

  getRolesOptions() {
    return this.props.allowedRoles ? this.props.allowedRoles.map((allowedRole, index) => {
      let role = '';
      switch (allowedRole) {
        case 'ROLE_STUDENT':
          role = 'Student';
          break;
        case 'ROLE_TEACHER':
          role = 'Teacher';
          break;
        case 'ROLE_ADMIN':
          role = 'Administrator';
          break;
        default:
          role = 'Student';
      }
      return <option value={allowedRole} key={index}>{role}</option>;
    }) : '';
  }

  render(): React.Component {
    const roles = this.getRolesOptions();
    return (
      <div className="userForm">
        <form>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" className="form-control" id="firstName" placeholder="First Name"
                   value={this.state.user.firstName} onChange={this.handleChange.bind(this, 'firstName')}/>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                   value={this.state.user.lastName} onChange={this.handleChange.bind(this, 'lastName')}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Email"
                   value={this.state.user.email} onChange={this.handleChange.bind(this, 'email')}/>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number"
                   value={this.state.user.phoneNumber} onChange={this.handleChange.bind(this, 'phoneNumber')}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password"
                   value={this.state.user.password} onChange={this.handleChange.bind(this, 'password')}/>
          </div>
          <div className="form-group">
            <label htmlFor="roles">Roles</label>
            <select className="form-control" multiple name="roles" id="roles" value={this.state.user.roles}
                    onChange={this.handleRoleChange.bind(this)}>
              {roles}
            </select>
          </div>
          <div className="form-group">
            <button type="button" className="col-xs-5 btn btn-primary" onClick={this.saveUser.bind(this)}>Save</button>
            <button type="button" className="col-xs-5 col-xs-offset-2 btn btn-default"
                    onClick={this.clearForm.bind(this)}>Clear
            </button>
          </div>
        </form>
        <div className="clearfix"></div>
        <div className="errors">
          {this.props.errors}
        </div>
      </div>
    );
  }
}
