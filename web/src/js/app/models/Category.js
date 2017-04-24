/* @flow */

export default class Category {
  id: string;
  name: string;
  description: string;

  constructor(data?: Object) {
    this.id = '';
    this.name = '';
    this.description = '';
    if (data) {
      this.populate(data);
    }
  }

  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string) {
    this.description = description;
  }

  populate(data: Object) {
    this.setId(data.id);
    this.setDescription(data.description);
    this.setName(data.name);
  }
}
