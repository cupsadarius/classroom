"use strict";
var LengthValidator_1 = require("./simple-validators/LengthValidator");
var CategoryValidator = (function () {
    function CategoryValidator() {
    }
    CategoryValidator.prototype.isValid = function (category, errorMessages) {
        if (errorMessages === void 0) { errorMessages = false; }
        var error = true;
        var errors = [];
        if (!LengthValidator_1.default.isValid(category.getName(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('name'));
        }
        if (!LengthValidator_1.default.isValid(category.getDescription(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('description'));
        }
        return errorMessages ? errors : error;
    };
    CategoryValidator.prototype.getErrors = function (category) {
        return this.isValid(category, true);
    };
    return CategoryValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryValidator;
