/* @flow */
import BasePage, {React} from './BasePage.jsx';
import SocketActions from '../actions/SocketActions.js';
import LessonActions from '../actions/LessonActions.js';
import {createStore} from '../stores/MultiStore.js';
import {createStore as createAuthStore} from '../stores/AuthStore.js';
import {createStore as createInstanceStore} from '../stores/InstanceStore.js';
import {createStore as createLessonStore} from '../stores/LessonStore.js';
import InstanceActions from '../actions/InstanceActions.js';
import cx from 'classnames';
import Attendees from '../components/instance/Attendees.jsx';
import Chat from '../components/instance/Chat.jsx';
import Board from '../components/instance/Board.jsx';

// const DEFAULT_FONT_SIZE = 14;

export default class SessionsPage extends BasePage {
  constructor(props) {
    super(props);
    this.sidebarWidth = 0;
  }

  createStore() {
    return createStore({
      auth: createAuthStore('auth'),
      instance: createInstanceStore('instance'),
      lesson: createLessonStore('lessons'),
    });
  }

  componentDidMount() {
    LessonActions.loadLessons();
    SocketActions.connect(this.props.params.sessionId);
    setTimeout(() => {
      SocketActions.participantJoined(this.props.params.sessionId, this.state.auth.currentUser);
    }, 100);
  }

  componentWillUnmount() {
    SocketActions.disconnect();
  }

  sendMessage(message: string) {
    SocketActions.sendChatMessage(this.props.params.sessionId, this.state.auth.currentUser, message);
  }

  changeTab(tab: string) {
    InstanceActions.changeTab(tab);
  }

  updateSidebarWidth() {
    this.sidebarWidth = $('.sidebar').innerWidth() ? $('.sidebar').innerWidth() : this.sidebarWidth;
  }

  render(): React.Element {
    const lesson = this.store.stores.lesson.getLessonById(this.props.params.lessonId);
    if (!lesson) {
      return null;
    }
    this.updateSidebarWidth();
    return (
      <div className="row classroom">
        <div className="col-md-2 sidebar">
          <div className="teachers text-center white">
            <h3>Teachers</h3>
            <Attendees attendees={this.state.instance.teachers}/>
          </div>
          <div>
            <div className="tabs">
              {this.state.instance.activeTab === 'attendees' ?
                <div className="text-center white">
                  <h3>Students</h3>
                  <Attendees attendees={this.state.instance.students}/>
                </div>
                : ''}
              {this.state.instance.activeTab === 'chat' ?
                <div className="text-center white">
                  <h3>Chat</h3>
                  <Chat chat={this.state.instance.chat} addMessage={this.sendMessage.bind(this)}/>
                </div>
                : ''}
            </div>
            <div className="tabs-nav">
              <button className={cx('button btn', {'active': this.state.instance.activeTab === 'attendees'})}
                      onClick={this.changeTab.bind(this, 'attendees')}><i className="fa fa-user"/></button>
              <button className={cx('button btn', {'active': this.state.instance.activeTab === 'chat'})}
                      onClick={this.changeTab.bind(this, 'chat')}>< i className="fa fa-telegram"/></button>
            </div>
          </div>
        </div>
        <Board
          lesson={lesson}
          board={
            {
              slides: this.state.instance.slides,
              activeSlide: this.state.instance.activeSlide,
              activeTool: this.state.instance.activeTool,
              activeColor: this.state.instance.activeColor,
            }
          }
          sessionId={this.props.params.sessionId}
          sidebarWidth={this.sidebarWidth}
        />
      </div>
    );
  }
}
