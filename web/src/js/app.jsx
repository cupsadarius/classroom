/* @flow */
import { Router, Route, browserHistory, IndexRoute} from 'react-router';
import BaseComponent, {React} from './app/components/BaseComponent.jsx';
import LoginPage from './app/pages/LoginPage.jsx';
import HomePage from './app/pages/HomePage.jsx';
import UsersPage from './app/pages/UsersPage.jsx';
import LessonsPage from './app/pages/LessonsPage.jsx';
import SessionsPage from './app/pages/SessionsPage.jsx';
import ContainerPage from './app/pages/ContainerPage.jsx';
import ReactDOM from 'react-dom';

// init api
import {instantiateAuthApi} from './app/api/AuthApi.js';
import {instantiateUserApi} from './app/api/UserApi.js';

instantiateAuthApi();
instantiateUserApi();
// init stores
import {createStore as createAuthStore} from './app/stores/AuthStore.js';
import {createStore as createUserStore} from './app/stores/UserStore.js';
createAuthStore('auth');
createUserStore('users');

export default class App extends BaseComponent {
  render(): React.Element {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={ContainerPage} >
          <IndexRoute component={LoginPage}/>
          <Route path='login' component={LoginPage}/>
          <Route path='home' component={HomePage}/>
          <Route path='users' component={UsersPage}/>
          <Route path='lessons' component={LessonsPage}/>
          <Route path='sessions' component={SessionsPage}/>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
