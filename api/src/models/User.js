"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseModel_1 = require("./BaseModel");
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super.call(this) || this;
        _this.roles = null;
        _this.firstName = '';
        _this.lastName = '';
        _this.email = '';
        _this.salt = '';
        _this.password = '';
        _this.phoneNumber = '';
        return _this;
    }
    User.prototype.getFirstName = function () {
        return this.firstName;
    };
    User.prototype.setFirstName = function (firstName) {
        this.firstName = firstName;
    };
    User.prototype.getLastName = function () {
        return this.lastName;
    };
    User.prototype.setLastName = function (lastName) {
        this.lastName = lastName;
    };
    User.prototype.getEmail = function () {
        return this.email;
    };
    User.prototype.setEmail = function (email) {
        this.email = email;
    };
    User.prototype.getSalt = function () {
        return this.salt;
    };
    User.prototype.setSalt = function (salt) {
        this.salt = salt;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.setPassword = function (password) {
        this.password = password;
    };
    User.prototype.getPhoneNumber = function () {
        return this.phoneNumber;
    };
    User.prototype.setPhoneNumber = function (phoneNumber) {
        this.phoneNumber = phoneNumber;
    };
    User.prototype.getRoles = function () {
        return this.roles;
    };
    User.prototype.setRoles = function (roles) {
        this.roles = roles;
    };
    User.prototype.addRole = function (role) {
        if (!this.roles) {
            this.roles = [];
        }
        if (!this.roles.filter(function (r) { return r === role; })) {
            this.roles.push(role);
        }
    };
    return User;
}(BaseModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = User;
