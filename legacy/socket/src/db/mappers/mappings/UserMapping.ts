export default class UserData {
    public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public salt: string;
    public password: string;
    public phoneNumber: string;
    public roles: string[];

    public stripSensitiveInfo() {
        this.password = '';
        this.salt = '';
    }
}