"use strict";
var EmailValidator = (function () {
    function EmailValidator() {
        this.valid = false;
    }
    EmailValidator.prototype.isValid = function (data) {
        if (data.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
            this.valid = true;
        }
        return this.valid;
    };
    EmailValidator.prototype.getError = function () {
        return "Invalid email address.";
    };
    return EmailValidator;
}());
exports.EmailValidator = EmailValidator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new EmailValidator();
