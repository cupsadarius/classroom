import UserValidator from './UserValidator';
import DefaultValidator from './DefaultValidator';
export class ValidatorFactory {

    /**
     *
     * @param className
     * @returns {UserValidator | DefaultValidator }
     */
    public getValidator(className: string) {
        switch (className) {
            case 'User': {
                return new UserValidator();
            }
            default: {
                console.log('No validators found for the provided entity');
                return new DefaultValidator();
            }
        }
    }
}

export default new ValidatorFactory();