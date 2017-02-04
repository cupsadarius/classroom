/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import Category from '../models/Category.js';
import {CategoriesLoadedSuccessfullyEvent, SelectCategoryEvent, CategoryFormErrorsEvent} from '../events/CategoriesEvents.js';

export class CategoryStore extends BaseStore {
  constructor() {
    super();

    this.state = {
      categories: null,
      selectedCategory: new Category(),
      errors: ''
    };
  }

  onCategoriesLoadedSuccessfullyEvent(event: CategoriesLoadedSuccessfullyEvent) {
    const state = this.getState();
    state.categories = event.categories;
    this.update(state);
    this.emitChange();
  }

  onSelectCategoryEvent(event: SelectCategoryEvent) {
    const state = this.getState();
    state.selectedCategory = event.category;
    this.update(state);
    this.emitChange();
  }

  onCategoryFormErrorsEvent(event: CategoryFormErrorsEvent) {
    const state = this.getState();
    state.errors = event.errors;
    this.update(state);
    this.emitChange();
  }
}

export let createStore = generateCreateStore(CategoryStore);