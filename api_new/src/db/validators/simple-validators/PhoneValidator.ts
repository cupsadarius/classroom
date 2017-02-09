export class PhoneValidator {
    private valid: boolean;

    constructor() {
        this.valid = false;
    }

    public isValid(data: string) {
        if (data.match(/^[\(\)\s\-\+\d]{10,17}$/)) {
            this.valid = true;
        }

        return this.valid;
    }

    public getError() {
        return `Invalid phone number.`;
    }
}

export default new PhoneValidator();
