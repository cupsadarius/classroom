"use strict";
var UserValidator_1 = require("./UserValidator");
var DefaultValidator_1 = require("./DefaultValidator");
var AttendeeValidator_1 = require("./AttendeeValidator");
var LessonValidator_1 = require("./LessonValidator");
var CategoryValidator_1 = require("./CategoryValidator");
var ValidatorFactory = (function () {
    function ValidatorFactory() {
    }
    /**
     *
     * @param className
     * @returns {UserValidator | DefaultValidator }
     */
    ValidatorFactory.prototype.getValidator = function (className) {
        switch (className) {
            case 'User': {
                return new UserValidator_1.default();
            }
            case 'Attendee': {
                return new AttendeeValidator_1.default();
            }
            case 'Lesson': {
                return new LessonValidator_1.default();
            }
            case 'Category': {
                return new CategoryValidator_1.default();
            }
            default: {
                console.log('No validators found for the provided entity');
                return new DefaultValidator_1.default();
            }
        }
    };
    return ValidatorFactory;
}());
exports.ValidatorFactory = ValidatorFactory;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new ValidatorFactory();
