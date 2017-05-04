/* @flow */
import { Router, Route, browserHistory, IndexRoute} from 'react-router';
import BaseComponent, {React} from './app/components/BaseComponent.jsx';
import LoginPage from './app/pages/LoginPage.jsx';
import HomePage from './app/pages/HomePage.jsx';
import UsersPage from './app/pages/UsersPage.jsx';
import TeachersPage from './app/pages/TeachersPage.jsx';
import StudentsPage from './app/pages/StudentsPage.jsx';
import LessonsPage from './app/pages/LessonsPage.jsx';
import SessionsPage from './app/pages/SessionsPage.jsx';
import ContainerPage from './app/pages/ContainerPage.jsx';
import CategoriesPage from './app/pages/CategoriesPage.jsx';
import ClassroomsPage from './app/pages/ClassroomsPage.jsx';
import Classroom from './app/pages/Classroom.jsx';
import ReactDOM from 'react-dom';

// init api
import {instantiateAuthApi} from './app/api/AuthApi.js';
import {instantiateUserApi} from './app/api/UserApi.js';
import {instantiateAttendeeApi} from './app/api/AttendeeApi.js';
import {instantiateCategoryApi} from './app/api/CategoryApi.js';
import {instantiateLessonApi} from './app/api/LessonApi.js';
import {instantiateClassroomApi} from './app/api/ClassroomApi.js';
import {instantiateSessionApi} from './app/api/SessionApi.js';
import {instantiateSocketApi} from './app/api/SocketApi.js';

instantiateAuthApi();
instantiateUserApi();
instantiateAttendeeApi();
instantiateCategoryApi();
instantiateLessonApi();
instantiateClassroomApi();
instantiateSessionApi();
instantiateSocketApi();
// init stores
import {createStore as createAuthStore} from './app/stores/AuthStore.js';
import {createStore as createUserStore} from './app/stores/UserStore.js';
import {createStore as createCategoryStore} from './app/stores/CategoryStore.js';
import {createStore as createLessonStore} from './app/stores/LessonStore.js';
import {createStore as createClassroomStore} from './app/stores/ClassroomStore.js';
import {createStore as createSessionStore} from './app/stores/SessionStore.js';
import {createStore as createInstanceStore} from './app/stores/InstanceStore.js';

createAuthStore('auth');
createUserStore('users');
createCategoryStore('categories');
createLessonStore('lessons');
createClassroomStore('classrooms');
createSessionStore('sessions');
createInstanceStore('instance');

export default class App extends BaseComponent {
  render(): React.Element {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={ContainerPage} >
          <IndexRoute component={LoginPage}/>
          <Route path="login" component={LoginPage}/>
          <Route path="home" component={HomePage}/>
          <Route path="session/:id" component={Classroom}/>
          <Route path="management/">
            <Route path="users" component={UsersPage}/>
            <Route path="teachers" component={TeachersPage}/>
            <Route path="students" component={StudentsPage}/>
            <Route path="lessons" component={LessonsPage}/>
            <Route path="sessions" component={SessionsPage}/>
            <Route path="categories" component={CategoriesPage}/>
            <Route path="classrooms" component={ClassroomsPage}/>
          </Route>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
