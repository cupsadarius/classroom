import UserValidator from './UserValidator';
import DefaultValidator from './DefaultValidator';
import AttendeeValidator from './AttendeeValidator';
import LessonValidator from './LessonValidator';
import CategoryValidator from './CategoryValidator';
import SessionValidator from './SessionValidator';
import ClassroomValidator from './ClassroomValidator';

export class ValidatorFactory {

    /**
     *
     * @param className
     * @returns {UserValidator | DefaultValidator }
     */
    public getValidator(className: string): UserValidator | AttendeeValidator | LessonValidator | CategoryValidator | SessionValidator | ClassroomValidator {
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
            case 'Session': {
                return new SessionValidator();
            }
            case 'Classroom': {
                return new ClassroomValidator();
            }
            default: {
                console.log('No validators found for the provided entity');
                return new DefaultValidator();
            }
        }
    }
}

export default new ValidatorFactory();