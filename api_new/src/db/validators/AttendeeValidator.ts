import Attendee from '../../models/Attendee';
import lengthValidator from './simple-validators/LengthValidator';
import emailValidator from './simple-validators/EmailValidator';
import phoneValidator from './simple-validators/PhoneValidator';

export default class AttendeeValidator {

    public isValid(attendee: Attendee, errorMessages: boolean = false) {
        let error = true;
        const errors = [];
        if (!lengthValidator.isValid(attendee.getFirstName(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('firstName'));
        }

        if (!lengthValidator.isValid(attendee.getLastName(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('lastName'));
        }

        if (!emailValidator.isValid(attendee.getEmail())) {
            error = error ? error : !error;
            errors.push(emailValidator.getError());
        }

        if (!phoneValidator.isValid(attendee.getPhoneNumber())) {
            error = error ? error : !error;
            errors.push(phoneValidator.getError());
        }

        if (!lengthValidator.isValid(attendee.getPassword(), 5)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('password'));
        }

        return errorMessages ? errors : error;
    }

    public getErrors(attendee: Attendee) {
        return this.isValid(attendee, true);
    }
}