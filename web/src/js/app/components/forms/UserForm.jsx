/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import User from '../../models/User.js';

export type UserFormProps = {
  user: User,
  save: (user) => void,
};

export default class UserForm extends BaseComponent {
  props: UserFormProps;

  render(): React.Component {
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" className="form-control" id="firstName" placeholder="First Name"
                   ref={firstName => this.firstName = firstName}/>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Lasr Name</label>
            <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                   ref={lastName => this.lastName = lastName}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Email"
                   ref={email => this.email = email}/>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number"
                   ref={phoneNumber => this.phoneNumber = phoneNumber}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password"
                   ref={password => this.password = password}/>
          </div>
          <div className="form-group">
            <label htmlFor="roles">Roles</label>
            <select className="form-control" multiple name="roles" id="roles">
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Teacher</option>
                <option value="ROLE_ADMIN">Administrator</option>
            </select>
          </div>
          <div className="form-group">
            <button type="button" className="col-xs-5 btn btn-primary">Save</button>
            <button type="button" className="col-xs-5 col-xs-offset-2 btn btn-default">Clear</button>
          </div>
        </form>
      </div>
    );
  }
}