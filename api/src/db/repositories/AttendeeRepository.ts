import BaseRepository from './BaseRepository';
import * as r from 'rethinkdb';
import Attendee from '../../models/Attendee';
import mapperFactory from '../mappers/MapperFactory';
import UserMapping from '../mappers/mappings/UserMapping';
import AttendeeMapper from '../mappers/AttendeeMapper';

export class AttendeeRepository extends BaseRepository {
    private mapper: AttendeeMapper;
    constructor() {
        super('users');
        this.mapper = mapperFactory.getMapper('Attendee') as AttendeeMapper;
    }

    public async getAllUsers() {
        try {
            const data = await this.getAll() as UserMapping[];
            return data.map(userData => this.mapper.hydrate(new Attendee(), userData));
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
            return this.mapper.hydrate(new Attendee(), data);
        } catch (e) {
            return e;
        }
    }

    public async getById(id: string) {
        try {
            const data = await this.get(id) as UserMapping;
            return this.mapper.hydrate(new Attendee(), data);
        } catch (e) {
            return e;
        }
    }

    public async getAttendeesByRole(role: string) {
        try {
            const data = await this.filter(r.row('roles').contains(role)) as UserMapping[];
            return data.map(item => this.mapper.hydrate(new Attendee(), item));
        } catch (e) {
            return e;
        }
    }

    public getMapper() {
        return this.mapper;
    }
}

export const attendeeRepository = new AttendeeRepository();
