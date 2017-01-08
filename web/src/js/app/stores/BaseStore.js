import Dispatcher from '../dispatchers/FluxDispatcher.js';
import {EventEmitter} from 'events';

/**
 * Base Store class.
 * Handles how a store reacts to each action sent.
 */
export default class BaseStore extends EventEmitter {
  constructor() {
    super();

    this.state = {};
  }

  /**
   * Update the state of the store
   * @param {state} The state object that we want to migrate to
   * @param {merge} If set to true the state will be updated instead of replaced
   */
  update(state, merge) {
    if (merge) {
      let crtState = this.state;
      Object.keys(state).forEach((key) => {
        crtState[key] = state[key];
      });
      state = crtState;
    }
    this.state = state;
  }

  /**
   * Get the current state of the store
   */
  getState() {
    return this.state;
  }

  /**
   * Emit a change notification so that the view can react and update the DOM
   */
  emitChange() {
    this.emit('CHANGE');
  }

  /**
   * Add a new listener for the change event
   */
  addChangeListener(cb) {
    this.setMaxListeners(this.listenerCount('CHANGE') + 1);
    this.on('CHANGE', cb);
  }

  /**
   * Remove a registered listener from the change event
   */
  removeChangeListener(cb) {
    this.removeListener('CHANGE', cb);
    this.setMaxListeners(this.listenerCount('CHANGE'));
  }

  /**
   * Register the store with the dispatcher and start listening for actions
   */
  register() {
    this.tokenId = Dispatcher.register(this.dispatch.bind(this));
  }

  /**
   * Handle an incomming action and call a special listener for that action if defined.
   *
   * For example for the SidebarChangeEvent action the onSidebarChangeEvent is
   * called on the store with the action object.
   */
  dispatch(action) {
    if (!action) {
      return;
    }
    if (this[`on${action.className}`]) {
      let emitChange = this[`on${action.className}`](action);
      if (emitChange === true) {
        console.warn('BaseStore.dispatch: Emitting change because handler method returned true');
        this.emitChange();
      } else if (emitChange) {
        console.error('BaseStore.dispatch: Ignored emitting change because return value was something, but not "true" explicitly');
      }
    }
  }
}

/**
 * Generates a factory function for the given store class
 * @param {StoreConstructor} Function to call that can create the store we want
 * @param {storeCollection} Object in which to save the store if an id is given
 */
export function generateCreateStore(StoreConstructor, storeCollection) {
  if (!storeCollection) {
    storeCollection = {};
  }
  /**
   * Return a factory function for the given class
   */
  return function (storeId, options) {
    // if a store id is given load it from the collection of created stores
    if (storeId && storeCollection.hasOwnProperty(storeId)) {
      return storeCollection[storeId];
    }
    let store = new StoreConstructor(options);
    // register the new store with the dispatcher
    store.register();
    if (storeId) {
      storeCollection[storeId] = store;
    }
    return store;
  };
}
