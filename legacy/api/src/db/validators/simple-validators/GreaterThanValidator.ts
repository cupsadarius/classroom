export class GreaterThanValidator {

    public isValid(item: number, graterThan: number): boolean {
        return item > graterThan;
    }

    public getError(fieldName: string, than: string) {
        return `${fieldName} is not greater than ${than}.`;
    }
}

export default new GreaterThanValidator();
