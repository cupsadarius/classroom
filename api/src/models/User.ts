import BaseModel from './BaseModel';

export default class User extends BaseModel {
    private firstName: string;
    private lastName: string;
    private email: string;
    private salt: string;
    private password: string;
    private phoneNumber: string;
    private roles: string[];

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
        if (!this.roles) {
            this.roles = [];
        }
        if (!this.hasRole(role)) {
            this.roles.push(role);
        }
    }

    public hasRole(roleSearched: string): boolean {
        return !!this.roles.filter(role => role === roleSearched).length;
    }
}
