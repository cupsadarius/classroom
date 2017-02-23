"use strict";
var LengthValidator = (function () {
    function LengthValidator() {
        this.valid = false;
    }
    LengthValidator.prototype.isValid = function (data, length) {
        if (data.length < length) {
            this.valid = true;
        }
        return this.valid;
    };
    LengthValidator.prototype.getError = function (fieldName) {
        return fieldName + " does not satisfy the minimum length required.";
    };
    return LengthValidator;
}());
exports.LengthValidator = LengthValidator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new LengthValidator();
