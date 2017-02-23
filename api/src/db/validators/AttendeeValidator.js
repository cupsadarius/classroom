"use strict";
var LengthValidator_1 = require("./simple-validators/LengthValidator");
var EmailValidator_1 = require("./simple-validators/EmailValidator");
var PhoneValidator_1 = require("./simple-validators/PhoneValidator");
var AttendeeValidator = (function () {
    function AttendeeValidator() {
    }
    AttendeeValidator.prototype.isValid = function (attendee, errorMessages) {
        if (errorMessages === void 0) { errorMessages = false; }
        var error = true;
        var errors = [];
        if (!LengthValidator_1.default.isValid(attendee.getFirstName(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('firstName'));
        }
        if (!LengthValidator_1.default.isValid(attendee.getLastName(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('lastName'));
        }
        if (!EmailValidator_1.default.isValid(attendee.getEmail())) {
            error = error ? error : !error;
            errors.push(EmailValidator_1.default.getError());
        }
        if (!PhoneValidator_1.default.isValid(attendee.getPhoneNumber())) {
            error = error ? error : !error;
            errors.push(PhoneValidator_1.default.getError());
        }
        if (!LengthValidator_1.default.isValid(attendee.getPassword(), 5)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('password'));
        }
        return errorMessages ? errors : error;
    };
    AttendeeValidator.prototype.getErrors = function (attendee) {
        return this.isValid(attendee, true);
    };
    return AttendeeValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttendeeValidator;
