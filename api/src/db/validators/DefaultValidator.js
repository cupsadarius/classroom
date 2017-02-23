"use strict";
var DefaultValidator = (function () {
    function DefaultValidator() {
    }
    DefaultValidator.prototype.isValid = function () {
        return true;
    };
    DefaultValidator.prototype.getErrors = function () {
        return [];
    };
    return DefaultValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DefaultValidator;
