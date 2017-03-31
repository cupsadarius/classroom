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

    /**
     * Returns an array with all users.
     */
    public async getAllUsers(): Promise<User[]> {
        try {
            const data = await this.getAll() as UserMapping[];
            return data.map(userData => this.mapper.hydrate(new User(), userData));
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns a user based on it's email address.
     */
    public async getByEmail(email: string, stripSensitive: boolean = false): Promise<User> {
        try {
            let data = (await this.filter({email}) as UserMapping[]).pop();
            if (stripSensitive) {
                data = this.stripSensitiveInfo(data);
            }
            return this.mapper.hydrate(new User(), data);
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns a user based on it's id.
     */
    public async getById(id: string): Promise<User> {
        try {
            const data = await this.get(id) as UserMapping;
            return this.mapper.hydrate(new User(), data);
        } catch (e) {
            return e;
        }
    }

    public stripSensitiveInfo(data: UserMapping) {
        data.password = '';
        data.salt = '';
        return data;
    }
    /**
     * Returns an instance of the UserMapper.
     */
    public getMapper(): UserMapper {
        return this.mapper;
    }
}

export const userRepository = new UserRepository();