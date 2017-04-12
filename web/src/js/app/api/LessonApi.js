/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import LocalStorage from '../helpers/LocalStorage.js';
import {handleUnauthorizedErrorResponse} from '../helpers/handleUnauthorizedErrorResponse.js';
import Lesson from '../models/Lesson.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import {LessonsLoadedSuccessfullyEvent, LoadLessonsEvent, SaveLessonEvent, DeleteLessonEvent, LessonFormErrorsEvent} from '../events/LessonEvents.js';

export class LessonApi extends BaseApi {

  onLoadLessonsEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/lesson`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        const categories = response.data.map(lesson => new Lesson(lesson));
        Dispatcher.dispatch(new LessonsLoadedSuccessfullyEvent(categories));
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

  onSaveLessonEvent(event: SaveLessonEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/lesson${event.lesson.id ? `/${event.lesson.id}` : ''}`,
      method: event.lesson.id ? 'PUT' : 'POST',
      headers: {'x-access-token': LocalStorage.get('token')},
      data: {
        title: event.lesson.title,
        description: event.lesson.description,
        categoryId: event.lesson.category.id,
        slides: event.lesson.slides,
      },
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadLessonsEvent());
          }, 1);
        } else {
          console.warn(response);
        }
      },
      error: (err) => {
        switch (err.status) {
          case 400: {
            Dispatcher.dispatch(new LessonFormErrorsEvent(err.responseJSON && err.responseJSON.data ? err.responseJSON.data : ''));
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

  onDeleteLessonEvent(event: DeleteLessonEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/lesson/${event.lessonId}`,
      method: 'DELETE',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadLessonsEvent());
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

export let instantiateLessonApi = generateApi(LessonApi);