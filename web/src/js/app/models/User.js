/* @flow */

export default class User {
  id: ?string;
  firstName: string;
  lastName: string;
  email: string;
  salt: ?string;
  password: string;
  phoneNumber: string;
  roles: string[];

  constructor(data?: Object) {
    this.id = null;
    this.roles = ['ROLE_USER'];
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.salt = null;
    this.password = '';
    this.phoneNumber = '';
    if (data) {
      this.populate(data);
    }
  }

  getId() {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getFirstName() {
    return this.firstName;
  }

  setFirstName(firstName: string) {
    this.firstName = firstName;
  }

  getLastName() {
    return this.lastName;
  }

  setLastName(lastName: string) {
    this.lastName = lastName;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getSalt() {
    return this.salt;
  }

  setSalt(salt: string) {
    this.salt = salt;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password: string) {
    this.password = password;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  setPhoneNumber(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  getRoles() {
    return this.roles;
  }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  addRole(role: string) {
    if (!this.roles.filter((r) => r === role)) {
      this.roles.push(role);
    }
  }

  hasRole(role: string) {
    return this.roles && this.roles.filter((r) => r === role).length;
  }

  populate(data: Object) {
    this.setId(data.id);
    this.setFirstName(data.firstName);
    this.setLastName(data.lastName);
    this.setEmail(data.email);
    this.setSalt(data.salt);
    this.setPassword(data.password);
    this.setPhoneNumber(data.phoneNumber);
    this.setRoles(data.roles);
  }
}
