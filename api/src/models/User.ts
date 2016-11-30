import BaseModel from './BaseModel';

export default class User extends BaseModel {
    private firstName: string;
    private lastName: string;
    private email: string;
    private salt: string;
    private password: string;
    private profilePicture: string;
    private phoneNumber: string;

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

    public getProfilePicture(): string {
        return this.profilePicture;
    }

    public setProfilePicture(profilePicture: string) {
        this.profilePicture = profilePicture;
    }

    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
    }
}
