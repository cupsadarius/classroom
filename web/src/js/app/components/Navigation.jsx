/* @flow */
import BaseComponent, {React} from './BaseComponent.jsx';
import Login from './auth/Login.jsx';

export default class Navigation extends BaseComponent {

  render(): React.Component {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Classroom</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i
                  className="fa fa-user-circle"></i> <span className="caret"></span></a>
                <div className="dropdown-menu account-bubble" role="menu">
                  <Login/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
