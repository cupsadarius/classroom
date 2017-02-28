import UserValidator from './UserValidator';
import DefaultValidator from './DefaultValidator';
import AttendeeValidator from './AttendeeValidator';
import LessonValidator from './LessonValidator';
import CategoryValidator from './CategoryValidator';
export class ValidatorFactory {

    /**
     *
     * @param className
     * @returns {UserValidator | DefaultValidator }
     */
    public getValidator(className: string): UserValidator | AttendeeValidator | LessonValidator | CategoryValidator {
        switch (className) {
            case 'User': {
                return new UserValidator();
            }
            case 'Attendee': {
                return new AttendeeValidator();
            }
            case 'Lesson': {
                return new LessonValidator();
            }
            case 'Category': {
                return new CategoryValidator();
            }
            default: {
                console.log('No validators found for the provided entity');
                return new DefaultValidator();
            }
        }
    }
}

export default new ValidatorFactory();