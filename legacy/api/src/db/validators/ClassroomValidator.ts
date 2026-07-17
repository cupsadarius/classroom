import notEmptyValidator from './simple-validators/NotEmptyValidator';
import Classroom from '../../models/Classroom';

export default class ClassroomValidator {
    isValid(classroom: Classroom, errorMessages: boolean = false) {
        let error = false;
        const errors = [];

        if (!notEmptyValidator.isValid(classroom.getTeachers())) {
            error = error ? error : !error;
            errors.push(notEmptyValidator.getError('teachers'));
        }

        return errorMessages ? errors : error;
    }

    getErrors(classroom: Classroom) {
        return this.isValid(classroom, true);
    }
}