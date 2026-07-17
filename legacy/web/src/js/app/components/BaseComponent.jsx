import React from 'react';
import ReactDOM from 'react-dom';

export {React};
export {ReactDOM};
export default class BaseComponent extends React.Component {
  /**
   * React component constructor.
   * If present load store from the list of properties, otherwise call a create method
   */
  constructor(props) {
    super(props);
    this.store = props && props.store ? props.store : this.createStore();
    if (this.store) {
      this.state = this.store.getState();
    }
  }

  /**
   * Default implementation of the createStore method. Should be overridden in the child classes
   */
  createStore() {
    return null;
  }

  getSessionState(key) {
    return SessionState.get(key);
  }

  getElement(ref) {
    return ReactDOM.findDOMNode(this.refs[ref]);
  }

  /**
   * Start listenning to actions when the component is mounted
   */
  componentWillMount() {
    if (this.store) {
      this.store.addChangeListener(this.changeCallback);
    }
  }

  /**
   * Stop listenning to actions when the component is destroyed
   */
  componentWillUnmount() {
    if (this.store) {
      this.store.removeChangeListener(this.changeCallback);
    }
  }

  /**
   * Process every state change and update the view
   */
  // NOTE(tp): This has to stay as a class variable for now. I tried to change it to a instance function but that broke the LC.
  changeCallback = (e) => {
    this.setState(this.store.getState());
  };
}
