import Category from '../../models/Category';
import lengthValidator from './simple-validators/LengthValidator';

export default class CategoryValidator {

    public isValid(category: Category, errorMessages: boolean = false) {
        let error = true;
        const errors = [];
        if (!lengthValidator.isValid(category.getName(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('name'));
        }

        if (!lengthValidator.isValid(category.getDescription(), 3)) {
            error = error ? error : !error;
            errors.push(lengthValidator.getError('description'));
        }

        return errorMessages ? errors : error;
    }

    public getErrors(category: Category) {
        return this.isValid(category, true);
    }
}
