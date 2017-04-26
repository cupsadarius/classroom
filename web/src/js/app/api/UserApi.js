/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import {UsersLoadedSuccessfullyEvent, SaveUserEvent, LoadUsersEvent, DeleteUserEvent, UserFormErrorsEvent} from '../events/UserEvents.js';
import LocalStorage from '../helpers/LocalStorage.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import User from '../models/User.js';
import {handleUnauthorizedErrorResponse} from '../helpers/handleUnauthorizedErrorResponse.js';
import $ from 'jquery';

export class UserApi extends BaseApi {
  onLoadUsersEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/user`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        const users = response.data.map(user => new User(user));
        Dispatcher.dispatch(new UsersLoadedSuccessfullyEvent(users));
      },
      error: (err) => {
        switch (err.status) {
          case 401: {
            handleUnauthorizedErrorResponse();
            break;
          }
          default: {
            return;
          }
        }
      },
    });
  }

  onSaveUserEvent(event: SaveUserEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/user${event.user.id ? `/${event.user.id}` : ''}`,
      method: event.user.id ? 'PUT' : 'POST',
      headers: {'x-access-token': LocalStorage.get('token')},
      data: {
        firstName: event.user.firstName,
        lastName: event.user.lastName,
        email: event.user.email,
        phoneNumber: event.user.phoneNumber,
        password: event.user.password,
      },
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadUsersEvent());
          }, 1);
        } else {
          console.warn(response);
        }
      },
      error: (err) => {
        switch (err.status) {
          case 400: {
            Dispatcher.dispatch(new UserFormErrorsEvent(err.responseJSON && err.responseJSON.data ? err.responseJSON.data : ''));
            break;
          }
          case 401: {
            handleUnauthorizedErrorResponse();
            break;
          }
          default: {
            return;
          }
        }
      },
    });
  }

  onDeleteUserEvent(event: DeleteUserEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/user/${event.userId}`,
      method: 'DELETE',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadUsersEvent());
          }, 1);
        } else {
          console.warn(response);
        }
      },
      error: (err) => {
        switch (err.status) {
          case 401: {
            handleUnauthorizedErrorResponse();
            break;
          }
          default: {
            return;
          }
        }
      },
    });
  }
}

export let instantiateUserApi = generateApi(UserApi);
