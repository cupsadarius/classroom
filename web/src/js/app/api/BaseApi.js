/* @flow */

import BaseStore, {generateCreateStore as generateApi} from '../stores/BaseStore.js';

export default class BaseApi extends BaseStore {};

export {generateApi};

export const API_BASE_URL = 'http://api.classroom.dkr';
export const API_VERSION = 'v1';
export const VERSIONED_BASE_API_URL = `${API_BASE_URL}/${API_VERSION}`