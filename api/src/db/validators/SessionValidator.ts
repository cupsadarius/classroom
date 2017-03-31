import Session from '../../models/Session';
import notEmptyValidator from './simple-validators/NotEmptyValidator';
import greaterThanValidator from './simple-validators/GreaterThanValidator';

export default class SessionValidator {
    public isValid(session: Session, errorMessages: boolean = false) {
        let error = true;
        const errors = [];

        if (!greaterThanValidator.isValid(session.getEndDate().getTime(), session.getStartDate().getTime())) {
            error = error ? error : !error;
            errors.push(greaterThanValidator.getError('endDate', 'startDate'));
        }

        if (!notEmptyValidator.isValid(session.getLesson().getId())) {
            error = error ? error : !error;
            errors.push(notEmptyValidator.getError('lesson'));
        }

        return errorMessages ? errors : error;
    }

    public getErrors(session: Session) {
        return this.isValid(session, true);
    }
}