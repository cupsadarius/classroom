/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import {LoginEvent, LoginSuccessfulEvent, LoginUnsuccessfulEvent, GetCurrentUserEvent, GetCurrentUserSuccessfullyEvent, GetCurrentUserUnSuccessfullyEvent} from '../events/AuthEvents.js';
import LocalStorage from '../helpers/LocalStorage.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import $ from 'jquery';

export class AuthApi extends BaseApi {
  onLoginEvent(event: LoginEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/authenticate`,
      method: 'POST',
      data: {
        username: event.email,
        password: event.password,
      },
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoginSuccessfulEvent(response.data));
          }, 1);
          setTimeout(() => {
            Dispatcher.dispatch(new GetCurrentUserEvent());
          }, 1);
        } else {
          Dispatcher.dispatch(new LoginUnsuccessfulEvent(response.data));
        }
      },
      error: (err) => {
        if (err.responseJSON) {
          Dispatcher.dispatch(new LoginUnsuccessfulEvent(err.responseJSON.data));
        }
      },
    });
  }

  onGetCurrentUserEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/current-user`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        if (response.status) {
          Dispatcher.dispatch(new GetCurrentUserSuccessfullyEvent(response.data));
        } else {
          Dispatcher.dispatch(new GetCurrentUserUnSuccessfullyEvent());
        }
      },
      error: (err) => {
        if (err.responseJSON) {
          Dispatcher.dispatch(new GetCurrentUserUnSuccessfullyEvent());
        }
      },
    });
  }

  onLogoutEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/logout`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
    });
  }
}

export let instantiateAuthApi = generateApi(AuthApi);