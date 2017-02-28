export class LengthValidator {
    private valid: boolean;

    constructor() {
        this.valid = false;
    }

    public isValid(data: string | any[], length: number): boolean {
        this.valid = false;
        if (data.length < length) {
            this.valid = true;
        }

        return this.valid;
    }

    public getError(fieldName: string) {
        return `${fieldName} does not satisfy the minimum length required.`;
    }
}

export default new LengthValidator();
