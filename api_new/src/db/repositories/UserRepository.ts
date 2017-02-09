import BaseRepository from './BaseRepository';
import User from '../../models/User';
import UserMapping from '../mappers/mappings/UserMapping';
import UserMapper from '../mappers/UserMapper';
import mapperFactory from '../mappers/MapperFactory';

export class UserRepository extends BaseRepository {
    private mapper: UserMapper;

    constructor() {
        super('users');
        this.mapper = mapperFactory.getMapper('User') as UserMapper;
    }

    public async getAllUsers() {
        try {
            const data = await this.getAll() as UserMapping[];
            return data.map(userData => this.mapper.hydrate(new User(), userData));
        } catch (e) {
            return e;
        }
    }

    public async getByEmail(email: string, stripSensitive = false) {
        try {
            const data = (await this.filter({email}) as UserMapping[]).pop();
            if (stripSensitive) {
                data.stripSensitiveInfo();
            }
            return this.mapper.hydrate(new User(), data);
        } catch (e) {
            return e;
        }
    }

    public async getById(id: string) {
        try {
            const data = await this.get(id) as UserMapping;
            return this.mapper.hydrate(new User(), data);
        } catch (e) {
            return e;
        }
    }

    public getMapper(): UserMapper {
        return this.mapper;
    }
}

export const userRepository = new UserRepository();