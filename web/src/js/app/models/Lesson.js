/* @flow */

import Category from './Category.js';

export default class Lesson {
  id: string;
  title: string;
  description: string;
  slides: Object[];
  category: ?Category;

  constructor(data?: Object) {
    this.id = '';
    this.title = '';
    this.description = '';
    this.slides = [];
    this.category = null;
    if(data) {
      this.populate(data);
    }
  }


  getId() {
    return this.id;
  }

  setId(value: string) {
    this.id = value;
  }

  getTitle() {
    return this.title;
  }

  setTitle(value: string) {
    this.title = value;
  }

  getDescription() {
    return this.description;
  }

  setDescription(value: string) {
    this.description = value;
  }

  getSlides() {
    return this.slides;
  }

  setSlides(value: Object[]) {
    this.slides = value;
  }

  getCategory() {
    return this.category;
  }

  setCategory(value: Category) {
    this.category = value;
  }

  getPastSessions() {

  }

  getFutureSessions() {

  }

  populate(data: Object) {
    this.setId(data.id || this.getId());
    this.setTitle(data.title || this.getTitle());
    this.setDescription(data.description || this.getDescription());
    this.setSlides(data.slides || this.getSlides());
    this.setCategory(new Category(data.category) || this.getCategory());
  }
}
