"use strict";
var LengthValidator_1 = require("./simple-validators/LengthValidator");
var EmailValidator_1 = require("./simple-validators/EmailValidator");
var PhoneValidator_1 = require("./simple-validators/PhoneValidator");
var UserValidator = (function () {
    function UserValidator() {
    }
    UserValidator.prototype.isValid = function (user, errorMessages) {
        if (errorMessages === void 0) { errorMessages = false; }
        var error = true;
        var errors = [];
        if (!LengthValidator_1.default.isValid(user.getFirstName(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('firstName'));
        }
        if (!LengthValidator_1.default.isValid(user.getLastName(), 3)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('lastName'));
        }
        if (!EmailValidator_1.default.isValid(user.getEmail())) {
            error = error ? error : !error;
            errors.push(EmailValidator_1.default.getError());
        }
        if (!PhoneValidator_1.default.isValid(user.getPhoneNumber())) {
            error = error ? error : !error;
            errors.push(PhoneValidator_1.default.getError());
        }
        if (!LengthValidator_1.default.isValid(user.getPassword(), 5)) {
            error = error ? error : !error;
            errors.push(LengthValidator_1.default.getError('password'));
        }
        return errorMessages ? errors : error;
    };
    UserValidator.prototype.getErrors = function (user) {
        return this.isValid(user, true);
    };
    return UserValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserValidator;
