/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import {UsersLoadedSuccessfullyEvent} from '../events/UserEvents.js';
import LocalStorage from '../helpers/LocalStorage.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import User from '../models/User.js';

import $ from 'jquery';

export class UserApi extends BaseApi {
  onLoadUsersEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/user`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
      if (response.status) {
        const users = response.data.map(user => new User(user));
        Dispatcher.dispatch(new UsersLoadedSuccessfullyEvent(users));
      } else {

      }
    },
      error: (err) => {
      if (err.responseJSON) {
      }
    },
    });
  }
}

export let instantiateUserApi = generateApi(UserApi);

