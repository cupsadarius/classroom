/* @flow */

import BaseAction from './BaseAction.js';
import * as categoriesEvents from '../events/CategoriesEvents.js';
import Category from '../models/Category.js';

export class CategoriesActions extends BaseAction {
  loadCategories() {
    this.trigger(new categoriesEvents.LoadCategoriesEvent());
  }
  selectCategory(category: Category) {
    this.trigger(new categoriesEvents.SelectCategoryEvent(category));
  }
  deleteCategory(categoryId: String) {
    this.trigger(new categoriesEvents.DeleteCategoryEvent(categoryId));
  }
  saveCategory(category: Category) {
    this.trigger(new categoriesEvents.SaveCategoryEvent(category));
  }
}

export default new CategoriesActions();