"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var User_1 = require("./User");
var Attendee = (function (_super) {
    __extends(Attendee, _super);
    function Attendee() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Attendee.prototype.setAsTeacher = function () {
        this.addRole('ROLE_STUDENT');
        this.addRole('ROLE_TEACHER');
    };
    Attendee.prototype.setAsStudent = function () {
        this.addRole('ROLE_STUDENT');
    };
    Attendee.prototype.isTeacher = function () {
        return this.getRoles().indexOf('ROLE_TEACHER');
    };
    Attendee.prototype.isStudent = function () {
        return this.getRoles().indexOf('ROLE_STUDENT');
    };
    return Attendee;
}(User_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Attendee;
