export class EmailValidator {
    private valid: boolean;

    constructor() {
        this.valid = false;
    }

    public isValid(data: string): boolean {
        if (data.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
            this.valid = true;
        }

        return this.valid;
    }

    public getError() {
        return `Invalid email address.`;
    }
}

export default new EmailValidator();
