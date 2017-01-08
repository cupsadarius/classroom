import {EventEmitter} from 'events';
import BaseStore from './BaseStore.js';

/**
 * Multi Store class.
 * Populates a single state based on multiple store objects
 */
export default class MultiStore extends EventEmitter {
  constructor(stores) {
    super();

    let state = {};
    Object.keys(stores).map((key) => {
      if (!(stores[key] instanceof BaseStore)) {
        state[key] = stores[key];
        delete stores[key];
      }
    });
    this.stores = stores;
    this.state = state;
  }

  /**
   * Handle the change event for any of the stores and update the current state.
   * Trigger the CHANGE event on the multi store to notify components.
   */
  onChange(store) {
    this.update(store, this.stores[store].getState());
  }

  /**
   * Update the state of the store
   * @param {store} The store that triggered the update
   * @param {state} The state object that we want to migrate to
   */
  update(store, state) {
    this.state[store] = state;
    this.emitChange();
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
    this.on('CHANGE', cb);
  }

  /**
   * Remove a registered listener from the change event
   */
  removeChangeListener(cb) {
    this.removeListener('CHANGE', cb);
  }

  /**
   * Register a listener for each watched store
   */
  register() {
    Object.keys(this.stores).forEach((key) => {
      this.state[key] = this.stores[key].getState();
      this.stores[key].addChangeListener(this.onChange.bind(this, key));
    });
  }

}

/**
 * Create a multi store based on a key:value object with the stores that it should listen to
 * @param {stores} A key:value object with stores that should be watched
 */
export function createStore(stores) {
  let store = new MultiStore(stores);
  store.register();
  return store;
}
