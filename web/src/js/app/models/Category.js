/* @flow */

export default class Category {
  id: ?String;
  name: String;
  description: String;

  constructor(data) {
    this.id = null;
    this.name = '';
    this.description = '';
    if (data) {
      this.populate(data);
    }
  }

  getId(): String {
    return this.id;
  }

  setId(id: String) {
    this.id = id;
  }

  getName(): String {
    return this.name;
  }

  setName(name: String) {
    this.name = name;
  }

  getDescription(): String {
    return this.description;
  }

  setDescription(description: String) {
    this.description = description;
  }

  populate(data) {
    this.setId(data.id);
    this.setDescription(data.description);
    this.setName(data.name);
  }
}
