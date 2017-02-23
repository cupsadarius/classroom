"use strict";
var PhoneValidator = (function () {
    function PhoneValidator() {
        this.valid = false;
    }
    PhoneValidator.prototype.isValid = function (data) {
        if (data.match(/^[\(\)\s\-\+\d]{10,17}$/)) {
            this.valid = true;
        }
        return this.valid;
    };
    PhoneValidator.prototype.getError = function () {
        return "Invalid phone number.";
    };
    return PhoneValidator;
}());
exports.PhoneValidator = PhoneValidator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new PhoneValidator();
