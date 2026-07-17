/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';

export type ChatProps = {
  chat: {user: string, message: string}[];
  addMessage: (message: string) => void;
}

export default class Chat extends BaseComponent {
  props: ChatProps;

  constructor() {
    super();
  }

  getChatMessages() {
    return this.props.chat ? this.props.chat.map((message, index) => {
      return (
        <div className="message" key={index}>
          <div className="name">
            {message.user}
          </div>
          <div className="text">
            {message.message}
          </div>
        </div>
      );
    }) : null;
  }

  sendMessage(e: Object) {
    let key = e.which || e.keyCode;
    if (key === 13 && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      this.props.addMessage(e.target.value);
      $(e.target).val('');
    }
  }

  render(): React.Element {
    return (
      <div className="chat">
        <div className="messages">
          {this.getChatMessages()}
        </div>
        <textarea className="input" onKeyDown={this.sendMessage.bind(this)} placeholder="Message"></textarea>
      </div>
    );
  }
}
