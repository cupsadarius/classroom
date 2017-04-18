/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import LocalStorage from '../helpers/LocalStorage.js';
import {handleUnauthorizedErrorResponse} from '../helpers/handleUnauthorizedErrorResponse.js';
import Classroom from '../models/Classroom.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import {ClassroomsLoadedSuccessfullyEvent, SaveClassroomEvent, LoadClassroomsEvent, ClassroomFormErrorsEvent, DeleteClassroomEvent} from '../events/ClassroomEvents.js';
export class ClassroomApi extends BaseApi {

  onLoadClassroomsEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/classroom`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        const categories = response.data.map(classroom => new Classroom(classroom));
        Dispatcher.dispatch(new ClassroomsLoadedSuccessfullyEvent(categories));
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

  onSaveClassroomEvent(event: SaveClassroomEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/classroom${event.classroom.id ? `/${event.classroom.id}` : ''}`,
      method: event.classroom.id ? 'PUT' : 'POST',
      headers: {'x-access-token': LocalStorage.get('token'), 'Content-Type': 'application/json'},
      data: JSON.stringify({
        name: event.classroom.name,
        lastSessionId: event.classroom.lastSessionId,
        students: event.classroom.students.map(student => student.id),
        teachers: event.classroom.teachers.map(teacher => teacher.id),
        sessions: event.classroom.sessions,
      }),
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadClassroomsEvent());
          }, 1);
        } else {
          console.warn(response);
        }
      },
      error: (err) => {
        switch (err.status) {
          case 400: {
            Dispatcher.dispatch(new ClassroomFormErrorsEvent(err.responseJSON && err.responseJSON.data ? err.responseJSON.data : ''));
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

  onDeleteClassroomEvent(event: DeleteClassroomEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/classroom/${event.classroomId}`,
      method: 'DELETE',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadClassroomsEvent());
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

export let instantiateClassroomApi = generateApi(ClassroomApi);