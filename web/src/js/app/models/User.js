/* @flow */

export default class User {
  id: ?String;
  firstName: String;
  lastName: String;
  email: String;
  salt: ?String;
  password: String;
  phoneNumber: String;
  roles: String[];

  constructor(data) {
    this.id = null;
    this.roles = ['ROLE_USER'];
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.salt = null;
    this.password = '';
    this.phoneNumber = '';
    if (data) this.populate(data);
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getFirstName() {
    return this.firstName;
  }

  setFirstName(firstName) {
    this.firstName = firstName;
  }

  getLastName() {
    return this.lastName;
  }

  setLastName(lastName) {
    this.lastName = lastName;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    this.email = email;
  }

  getSalt() {
    return this.salt;
  }

  setSalt(salt) {
    this.salt = salt;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password) {
    this.password = password;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  getRoles() {
    return this.roles;
  }

  setRoles(roles) {
    this.roles = roles;
  }

  addRole(role) {
    if (!this.roles.filter((r) => r === role)) {
      this.roles.push(role);
    }
  }

  hasRole(role) {
    return this.roles && this.roles.filter((r) => r === role).length;
  }

  populate(data) {
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
