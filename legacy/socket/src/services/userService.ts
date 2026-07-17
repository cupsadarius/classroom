import UserMapping from '../db/mappers/mappings/UserMapping';
import User from '../models/User';
import {db} from '../db';
import {UserRepository} from '../db/repositories/UserRepository';
import {authService} from './authService';

export class UserService {

    public async getUsers() {
        try {
            return await this.getUserRepository().getAllUsers();
        } catch (e) {
            throw e;
        }
    }

    public async getById(id: string) {
        try {
            return await this.getUserRepository().getById(id);
        } catch (e) {
            throw e;
        }
    }

    public async getByEmail(email: string, stripSensitive = false) {
        try {
            return await this.getUserRepository().getByEmail(email, stripSensitive);
        } catch (e) {
            throw e;
        }
    }

    private getUserRepository(): UserRepository {
        return db.getRepo('userRepository') as UserRepository;
    }
}

export const userService = new UserService();