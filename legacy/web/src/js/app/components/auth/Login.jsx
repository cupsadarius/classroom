/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import {Link, browserHistory} from 'react-router';
import AuthActions from '../../actions/AuthActions.js';
import {createStore as createAuthStore} from '../../stores/AuthStore.js';
import MD5 from '../../helpers/MD5.js';

export default class Login extends BaseComponent {
  createStore() {
    return createAuthStore('auth');
  }

  componentDidMount() {
    if (this.state.currentUser) {
      browserHistory.push('/home');
    }
  }

  login() {
    AuthActions.login(this.email.value, this.password.value);
  }

  logout() {
    AuthActions.logout();
  }

  render(): React.Component {
    const currentUser = this.state.currentUser;
    return (
      <div>
        {
          currentUser ?
            (
              <div>
                <div className="row text-center">
                  <img className="profileImage" src={`https://www.gravatar.com/avatar/${MD5.hash(currentUser.getEmail())}`} />
                </div>
                <div className="row text-center">
                  Welcome back <strong>{`${currentUser.getFirstName()} ${currentUser.getLastName()}`}</strong>
                </div>
                <div className="row text-center">
                  <button className="btn btn-primary col-xs-10 col-xs-offset-1" onClick={this.logout.bind(this)}>Logout</button>
                </div>
              </div>
            ) :
            (
              <div>
                <form>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" placeholder="Email"
                           ref={email => this.email = email}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password"
                           ref={password => this.password = password}/>
                  </div>
                  <div className="form-group">
                    <button type="button" className="btn btn-primary col-sm-5" onClick={this.login.bind(this)}>Submit
                    </button>
                    <Link to='/register' className="btn btn-primary col-sm-5 col-sm-offset-2">Register</Link>
                  </div>
                </form>
                <div className="clearfix"/>
                {this.state.error ?
                  <div className="errors">
                    <i className="fa fa-exclamation-triangle" ariaHidden="true"></i>
                    {this.state.error}
                  </div> :
                  ''
                }
              </div>
            )
        }
      </div>
    );
  };
}