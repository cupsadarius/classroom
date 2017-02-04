/* @flow */

import BaseApi, {generateApi, VERSIONED_BASE_API_URL} from './BaseApi.js';
import LocalStorage from '../helpers/LocalStorage.js';
import {handleUnauthorizedErrorResponse} from '../helpers/handleUnauthorizedErrorResponse.js';
import Category from '../models/Category.js';
import Dispatcher from '../dispatchers/FluxDispatcher.js';
import {CategoriesLoadedSuccessfullyEvent, SaveCategoryEvent, LoadCategoriesEvent, CategoryFormErrorsEvent, DeleteCategoryEvent} from '../events/CategoriesEvents.js';
export class CategoryApi extends BaseApi {

  onLoadCategoriesEvent() {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/category`,
      method: 'GET',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        const categories = response.data.map(category => new Category(category));
        Dispatcher.dispatch(new CategoriesLoadedSuccessfullyEvent(categories));
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

  onSaveCategoryEvent(event: SaveCategoryEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/category${event.category.id ? `/${event.category.id}` : ''}`,
      method: event.category.id ? 'PUT' : 'POST',
      headers: {'x-access-token': LocalStorage.get('token')},
      data: {
        name: event.category.name,
        description: event.category.description,
      },
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadCategoriesEvent());
          }, 1);
        } else {
          console.warn(response);
        }
      },
      error: (err) => {
        switch (err.status) {
          case 400: {
            Dispatcher.dispatch(new CategoryFormErrorsEvent(err.responseJSON && err.responseJSON.data ? err.responseJSON.data : ''));
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

  onDeleteCategoryEvent(event: DeleteCategoryEvent) {
    $.ajax({
      url: `${VERSIONED_BASE_API_URL}/category/${event.categoryId}`,
      method: 'DELETE',
      headers: {'x-access-token': LocalStorage.get('token')},
      success: (response) => {
        if (response.status) {
          setTimeout(() => {
            Dispatcher.dispatch(new LoadCategoriesEvent());
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

export let instantiateCategoryApi = generateApi(CategoryApi);