"use strict";
var LengthValidator_1 = require("./simple-validators/LengthValidator");
var NotEmptyValidator_1 = require("./simple-validators/NotEmptyValidator");
var LessonValidator = (function () {
    function LessonValidator() {
    }
    LessonValidator.prototype.isValid = function (lesson, errorMessages) {
        if (errorMessages === void 0) { errorMessages = false; }
        var error = true;
        var errors = [];
        if (!LengthValidator_1.default.isValid(lesson.getTitle(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('title'));
        }
        if (!LengthValidator_1.default.isValid(lesson.getDescription(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('description'));
        }
        if (!LengthValidator_1.default.isValid(lesson.getSlides(), 1)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('slides'));
        }
        if (!NotEmptyValidator_1.default.isValid(lesson.getCategory().getId())) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('category'));
        }
        return errorMessages ? errors : error;
    };
    LessonValidator.prototype.getErrors = function (lesson) {
        return this.isValid(lesson, true);
    };
    return LessonValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LessonValidator;
