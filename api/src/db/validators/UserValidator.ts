import User from '../../models/User';
import lengthValidator from './simple-validators/LengthValidator';
import emailValidator from './simple-validators/EmailValidator';
import phoneValidator from './simple-validators/PhoneValidator';

export default class UserValidator {

    public isValid(user: User, errorMessages: boolean = false) {
        let error = true;
        const errors = [];
        if (!lengthValidator.isValid(user.getFirstName(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('firstName'));
        }

        if (!lengthValidator.isValid(user.getLastName(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('lastName'));
        }

        if (!emailValidator.isValid(user.getEmail())) {
            error = error ? error : !error;
            errors.push(emailValidator.getError());
        }

        if (!phoneValidator.isValid(user.getPhoneNumber())) {
            error = error ? error : !error;
            errors.push(phoneValidator.getError());
        }

        if (!lengthValidator.isValid(user.getPassword(), 5)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('password'));
        }

        return errorMessages ? errors : error;
    }

    public getErrors(user: User) {
        return this.isValid(user, true);
    }
}