/* @flow */
import Category from '../models/Category.js';

export class LoadCategoriesEvent {
  className: String;

  constructor() {
    this.className = 'LoadCategoriesEvent';
  }
}

export class CategoriesLoadedSuccessfullyEvent {
  className: String;
  categories: Category[];

  constructor(categories: Category[]) {
    this.className = 'CategoriesLoadedSuccessfullyEvent';
    this.categories = categories;
  }
}

export class SaveCategoryEvent {
  className: String;
  category: Category;

  constructor(category: Category) {
    this.className = 'SaveCategoryEvent';
    this.category = category;
  }
}

export class SelectCategoryEvent {
  className: String;
  category: Category;

  constructor(category: Category) {
    this.className = 'SelectCategoryEvent';
    this.category = category;
  }
}

export class DeleteCategoryEvent {
  className: String;
  categoryId: String;

  constructor(categoryId: String) {
    this.className = 'DeleteCategoryEvent';
    this.categoryId = categoryId;
  }
}

export class CategoryFormErrorsEvent {
  className: String;
  errors: String;

  constructor(errors: String) {
    this.className = 'CategoryFormErrorsEvent';
    this.errors = errors;
  }
}