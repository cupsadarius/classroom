import BaseModel from './BaseModel';
export default class BlacklistToken extends BaseModel {
    private token: string;

    public getToken(): string {
        return this.token;
    }

    public setToken(token: string) {
        this.token = token;
    }
}
