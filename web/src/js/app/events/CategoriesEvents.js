/* @flow */
import Category from '../models/Category.js';

export class LoadCategoriesEvent {
  className: string;

  constructor() {
    this.className = 'LoadCategoriesEvent';
  }
}

export class CategoriesLoadedSuccessfullyEvent {
  className: string;
  categories: Category[];

  constructor(categories: Category[]) {
    this.className = 'CategoriesLoadedSuccessfullyEvent';
    this.categories = categories;
  }
}

export class SaveCategoryEvent {
  className: string;
  category: Category;

  constructor(category: Category) {
    this.className = 'SaveCategoryEvent';
    this.category = category;
  }
}

export class SelectCategoryEvent {
  className: string;
  category: Category;

  constructor(category: Category) {
    this.className = 'SelectCategoryEvent';
    this.category = category;
  }
}

export class DeleteCategoryEvent {
  className: string;
  categoryId: string;

  constructor(categoryId: string) {
    this.className = 'DeleteCategoryEvent';
    this.categoryId = categoryId;
  }
}

export class CategoryFormErrorsEvent {
  className: string;
  errors: string;

  constructor(errors: string) {
    this.className = 'CategoryFormErrorsEvent';
    this.errors = errors;
  }
}
