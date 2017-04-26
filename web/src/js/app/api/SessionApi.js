/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import LocalStorage from '../helpers/LocalStorage.js';
import {handleUnauthorizedErrorResponse} from '../helpers/handleUnauthorizedErrorResponse.js';
import Session from '../models/Session.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import {SaveSessionEvent, LoadSessionsEvent, SessionFormErrorsEvent, DeleteSessionEvent} from '../events/SessionEvents.js';

export class SessionApi extends BaseApi {

  loadSessions(classroomId: string) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/session/${classroomId}`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        const sessions = response.data.map(session => new Session(session));
        Dispatcher.dispatch(new LoadSessionsEvent(sessions));
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

  onSaveSessionEvent(event: SaveSessionEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/session/${event.classroom.id}${event.session.id ? `/${event.session.id}` : ''}`,
      method: event.session.id ? 'PUT' : 'POST',
      headers: {'x-access-token': LocalStorage.get('token'), 'Content-Type': 'application/json'},
      data: JSON.stringify({
        startDate: event.session.getStartDate(),
        endDate: event.session.getEndDate(),
        lessonId: event.session.lesson.getId(),
      }),
      success: (response) => {
        if (response.status) {
          this.loadSessions(event.classroom.id);
        } else {
          console.warn(response);
        }
      },
      error: (err) => {
        switch (err.status) {
          case 400: {
            Dispatcher.dispatch(new SessionFormErrorsEvent(err.responseJSON && err.responseJSON.data ? err.responseJSON.data : ''));
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

  onDeleteSessionEvent(event: DeleteSessionEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/session/${event.classroomId}/${event.sessionId}`,
      method: 'DELETE',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            this.loadSessions(event.classroomId);
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

export let instantiateSessionApi = generateApi(SessionApi);
