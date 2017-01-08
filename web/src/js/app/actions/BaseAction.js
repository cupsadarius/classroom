import Dispatcher from '../dispatchers/FluxDispatcher.js';

/**
 * Base Action class for all the action creator classes
 */
export default class BaseAction {

  triggerOnceAfter(name, callback) {
    let dispatcher = this.getDispatcher();
    let token = dispatcher.register((event) => {
      if (event.className !== name) {
        return;
      }
      dispatcher.unregister(token);
      setTimeout(() => callback(event), 0);
    });
    return token;
  }

  getDispatcher() {
    return Dispatcher;
  }
  /**
   * Send a new action to the dispatcher
   */
  trigger(action) {
    this.getDispatcher().dispatch(action);
  }
}
