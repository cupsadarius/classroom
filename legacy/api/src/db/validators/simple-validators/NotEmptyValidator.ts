export class NotEmptyValidator {
    private valid: boolean;

    constructor() {
        this.valid = false;
    }

    public isValid(data: string | any[]) {
        if (data.length === 0) {
            this.valid = true;
        }

        return this.valid;
    }

    public getError(fieldName: string) {
        return `${fieldName} should not be empty.`;
    }
}

export default new NotEmptyValidator();
