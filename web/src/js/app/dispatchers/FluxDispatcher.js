import {Dispatcher} from 'flux';

class FluxDispatcher extends Dispatcher {
  dispatch(payload) {
    if (payload == null) {
      throw new Error('FluxDispatcher.dispatch: no payload was given');
    }

    console.info('Dispatcher: ', payload);

    super.dispatch(payload);
  }
}

export default new FluxDispatcher();
