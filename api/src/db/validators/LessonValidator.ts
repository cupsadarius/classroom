import Lesson from '../../models/Lesson';
import lengthValidator from './simple-validators/LengthValidator';
import notEmptyValidator from './simple-validators/NotEmptyValidator';

export default class LessonValidator {

    public isValid(lesson: Lesson, errorMessages: boolean = false) {
        let error = true;
        const errors = [];
        if (!lengthValidator.isValid(lesson.getTitle(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('title'));
        }

        if (!lengthValidator.isValid(lesson.getDescription(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('description'));
        }

        if (!lengthValidator.isValid(lesson.getSlides(), 1)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('slides'));
        }

        if (!notEmptyValidator.isValid(lesson.getCategory().getId())) {
            error = error ? error : !error;
            errors.push(notEmptyValidator.getError('category'));
        }

        return errorMessages ? errors : error;
    }

    public getErrors(lesson: Lesson) {
        return this.isValid(lesson, true);
    }
}
