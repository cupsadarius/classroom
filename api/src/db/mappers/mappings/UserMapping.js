"use strict";
var UserData = (function () {
    function UserData() {
    }
    UserData.prototype.stripSensitiveInfo = function () {
        this.password = '';
        this.salt = '';
    };
    return UserData;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserData;
