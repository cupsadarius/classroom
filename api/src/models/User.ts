import BaseModel from './BaseModel';

export type UserErrors = {
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    phoneNumber?: string,
};

export default class User extends BaseModel {
    private firstName: string;
    private lastName: string;
    private email: string;
    private salt: string;
    private password: string;
    private phoneNumber: string;
    private roles: string[];
    private errors: UserErrors;

    constructor() {
        super();
        this.roles = ['ROLE_USER'];
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.salt = '';
        this.password = '';
        this.phoneNumber = '';
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public setLastName(lastName: string) {
        this.lastName = lastName;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public getSalt(): string {
        return this.salt;
    }

    public setSalt(salt: string) {
        this.salt = salt;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
    }

    public getRoles(): string[] {
        return this.roles;
    }

    public setRoles(roles: string[]) {
        this.roles = roles;
    }

    public addRole(role: string) {
        if (!this.roles.filter((r) => r === role)) {
            this.roles.push(role);
        }
    }

    public isValid(): boolean {
        let error = true;

        if (this.firstName.length < 3) {
            this.errors.firstName = this.generateErrorMessage('first name', this.firstName);
            error = error ? error : !error;
        }

        if (this.lastName.length < 3) {
            this.errors.lastName = this.generateErrorMessage('last name', this.lastName);
            error = error ? error : !error;
        }

        if (!this.email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
            this.errors.email = this.generateErrorMessage('email', this.email);
            error = error ? error : !error;
        }

        if (!this.phoneNumber.match(/^[\(\)\s\-\+\d]{10,17}$/)) {
            this.errors.phoneNumber = this.generateErrorMessage('phone number', this.phoneNumber);
            error = error ? error : !error;
        }

        if (this.password.length < 5) {
            this.errors.password = this.generateErrorMessage('password', '');
            error = error ? error : !error;
        }

        return error;
    }

    public getErrors(): UserErrors {
        return this.errors;
    }
    private generateErrorMessage(field: string, value: string): string {
        return `The value ${value} used for the ${field} is not a valid one.`;
    }
}
