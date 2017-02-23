"use strict";
var NotEmptyValidator = (function () {
    function NotEmptyValidator() {
        this.valid = false;
    }
    NotEmptyValidator.prototype.isValid = function (data) {
        if (data.length === 0) {
            this.valid = true;
        }
        return this.valid;
    };
    NotEmptyValidator.prototype.getError = function (fieldName) {
        return fieldName + " should not be empty.";
    };
    return NotEmptyValidator;
}());
exports.NotEmptyValidator = NotEmptyValidator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new NotEmptyValidator();
