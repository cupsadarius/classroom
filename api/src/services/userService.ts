import UserMapping from '../db/mappers/mappings/UserMapping';
import User from '../models/User';
import {db} from '../db';
import {UserRepository} from '../db/repositories/UserRepository';
import validatorFactory from '../db/validators/ValidatorFactory';
import UserValidator from '../db/validators/UserValidator';
import {authService} from './authService';

export class UserService {
    private validator: UserValidator;

    constructor() {
        this.validator = validatorFactory.getValidator('User') as UserValidator;
    }
    public async saveUser(data: UserMapping) {
        try {
            const repo = this.getUserRepository();
            const user = repo.getMapper().hydrate(new User(), data);
            if (!this.validator.isValid(user)) {
                return this.validator.getErrors(user);
            }
            user.setSalt(authService.createSalt());
            user.setPassword(authService.hashPassword(user.getPassword(), data.password));
            const count = await repo.count({email: user.getEmail()});
            if (count) {
                throw new Error(`An user with the ${user.getEmail()} already exists in the database.`);
            }
            return await repo.insert(repo.getMapper().dehydrate(user));
        } catch (e) {
            return e;
        }
    }

    public async getUsers() {
        try {
            return await this.getUserRepository().getAllUsers();
        } catch (e) {
            return e;
        }
    }

    public async getById(id: string) {
        try {
            return await this.getUserRepository().getById(id);
        } catch (e) {
            return e;
        }
    }

    public async getByEmail(email: string, stripSensitive = false) {
        try {
            return await this.getUserRepository().getByEmail(email, stripSensitive);
        } catch (e) {
            return e;
        }
    }

    public async update(id: string, data: UserMapping) {
        try {
            const repo = this.getUserRepository();
            let user = await repo.getById(id);
            data.password = data.password ? authService.hashPassword(user.getSalt(), data.password) : data.password;
            user = repo.getMapper().hydrate(user, data);
            if (!this.validator.isValid(user)) {
                return this.validator.getErrors(user);
            }
            const updated = await repo.update({id}, user);
            if (updated) {
                return repo.getMapper().dehydrate(user).stripSensitiveInfo();
            }
        } catch (e) {
            return e;
        }
    }

    public async delete(id: string) {
        try {
            return await this.getUserRepository().delete([id]);
        } catch (e) {
            return e;
        }
    }

    private getUserRepository(): UserRepository {
        return db.getRepo('userRepository') as UserRepository;
    }
}

export const userService = new UserService();