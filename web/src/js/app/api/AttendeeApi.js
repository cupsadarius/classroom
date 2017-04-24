/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import {
  TeachersLoadedSuccessfullyEvent,
  StudentsLoadedSuccessfullyEvent,
  SaveAttendeeEvent,
  LoadTeachersEvent,
  LoadStudentsEvent,
  DeleteAttendeeEvent,
  AttendeeFormErrorsEvent
} from '../events/AttendeeEvents.js';
import LocalStorage from '../helpers/LocalStorage.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import User from '../models/User.js';
import {handleUnauthorizedErrorResponse} from '../helpers/handleUnauthorizedErrorResponse.js';
import $ from 'jquery';

export class AttendeeApi extends BaseApi {
  onLoadTeachersEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/attendee/teacher`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        const users = response.data.map(user => new User(user));
        Dispatcher.dispatch(new TeachersLoadedSuccessfullyEvent(users));
      },
      error: (err) => {
        switch (err.status) {
          case 401: {
            handleUnauthorizedErrorResponse();
            break;
          }
        }
      },
    });
  }

  onLoadStudentsEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/attendee/student`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        const users = response.data.map(user => new User(user));
        Dispatcher.dispatch(new StudentsLoadedSuccessfullyEvent(users));
      },
      error: (err) => {
        switch (err.status) {
          case 401: {
            handleUnauthorizedErrorResponse();
            break;
          }
        }
      },
    });
  }

  onSaveAttendeeEvent(event: SaveAttendeeEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/attendee${event.user.hasRole('ROLE_TEACHER') ? '/teacher' : '/student'}${event.user.id ? `/${event.user.id}` : ''}`,
      method: event.user.id ? 'PUT' : 'POST',
      headers: {'x-access-token': LocalStorage.get('token')},
      data: {
        firstName: event.user.firstName,
        lastName: event.user.lastName,
        email: event.user.email,
        phoneNumber: event.user.phoneNumber,
        password: event.user.password
      },
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(event.user.hasRole('ROLE_TEACHER') ? new LoadTeachersEvent() : new LoadStudentsEvent());
          }, 1);
        } else {
          console.warn(response);
        }
      },
      error: (err) => {
        switch (err.status) {
          case 400: {
            Dispatcher.dispatch(new AttendeeFormErrorsEvent(err.responseJSON && err.responseJSON.data ? err.responseJSON.data : ''));
            break;
          }
          case 401: {
            handleUnauthorizedErrorResponse();
            break;
          }
        }
      }
    });
  }

  onDeleteAttendeeEvent(event: DeleteAttendeeEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/attendee${event.user.hasRole('ROLE_TEACHER') ? '/teacher' : '/student'}/${event.userId}`,
      method: 'DELETE',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadStudentsEvent());
            Dispatcher.dispatch(new LoadTeachersEvent());
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
        }
      }
    });
  }
}

export let instantiateAttendeeApi = generateApi(AttendeeApi);

