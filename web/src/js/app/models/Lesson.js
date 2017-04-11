/* @flow */

import Category from './Category.js';

export default class Lesson {
  id: String;
  title: String;
  description: String;
  slides: Array<Object>;
  category: Category;

  constructor(data) {
    this.id = null;
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

  setId(value) {
    this.id = value;
  }

  getTitle() {
    return this.title;
  }

  setTitle(value) {
    this.title = value;
  }

  getDescription() {
    return this.description;
  }

  setDescription(value) {
    this.description = value;
  }

  getSlides() {
    return this.slides;
  }

  setSlides(value) {
    this.slides = value;
  }

  getCategory() {
    return this.category;
  }

  setCategory(value) {
    this.category = value;
  }

  populate(data) {
    this.setId(data.id || this.getId());
    this.setTitle(data.title || this.getTitle());
    this.setDescription(data.description || this.getDescription());
    this.setSlides(data.slides || this.getSlides());
    this.setCategory(new Category(data.category) || this.getCategory());
  }
}