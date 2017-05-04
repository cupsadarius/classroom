/* @flow */
import BasePage, {React} from './BasePage.jsx';
import SocketActions from '../actions/SocketActions.js';
import InstanceActions from '../actions/InstanceActions.js';
import {createStore} from '../stores/MultiStore.js';
import {createStore as createAuthStore} from '../stores/AuthStore.js';
import {createStore as createInstanceStore} from '../stores/InstanceStore.js';
import cx from 'classnames';
import Attendees from '../components/instance/Attendees.jsx';
import Chat from '../components/instance/Chat.jsx';

export default class SessionsPage extends BasePage {
  constructor() {
    super();
  }

  createStore() {
    return createStore({
      auth: createAuthStore('auth'),
      instance: createInstanceStore('instance'),
    });
  }

  componentDidMount() {
    SocketActions.connect(this.props.params.id);
    setTimeout(() => {
      SocketActions.participantJoined(this.props.params.id, this.state.auth.currentUser);
    }, 100);
  }

  componentWillUnmount() {
    SocketActions.disconnect();
  }

  changeTab(tab: string) {
    InstanceActions.changeTab(tab);
  }

  sendMessage(message: string) {
    SocketActions.sendChatMessage(this.props.params.id, this.state.auth.currentUser, message);
  }

  render(): React.Element {
    return (
      <div className="row classroom">
        <div className="col-md-2 sidebar">
          <div className="teachers text-center white">
            <h3>Teachers</h3>
            <Attendees attendees={this.state.instance.teachers} />
          </div>
          <div>
            <div className="tabs">
              {this.state.instance.activeTab === 'attendees' ?
                <div className="text-center white">
                  <h3>Students</h3>
                  <Attendees attendees={this.state.instance.students} />
                </div>
                : ''}
              {this.state.instance.activeTab === 'chat' ?
                <div className="text-center white">
                  <h3>Chat</h3>
                  <Chat chat={this.state.instance.chat} addMessage={this.sendMessage.bind(this)} />
                </div>
                : ''}
            </div>
            <div className="tabs-nav">
              <button className={cx('button btn', {'active': this.state.instance.activeTab === 'attendees'})} onClick={this.changeTab.bind(this, 'attendees')}><i className="fa fa-user" /> </button>
              <button className={cx('button btn', {'active': this.state.instance.activeTab === 'chat'})} onClick={this.changeTab.bind(this, 'chat')}>< i className="fa fa-telegram" /> </button>
            </div>
          </div>
        </div>
        <div className="col-md-10 col-md-offset-2 tools">
          tools
        </div>
        <div className="col-md-10 col-md-offset-2 canvas">
          container
        </div>
        <div className="col-md-10 col-md-offset-2 navigation">
          botom bar
        </div>
      </div>
    );
  }
}
