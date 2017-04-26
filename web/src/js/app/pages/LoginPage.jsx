/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Login from '../components/auth/Login.jsx';

export default class LoginPage extends BasePage {
  render(): React.Element {
    return (
      <div className="loginContainer col-md-6 col-md-offset-3">
        <Login />
      </div>
    );
  }
}
