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

    /**
     * Returns all attendees.
     * 
     * @return Promise<Attendee[]>
     */
    public async getAllUsers(): Promise<Attendee[]> {
        try {
            const data = await this.getAll() as UserMapping[];
            return data.map(userData => this.mapper.hydrate(new Attendee(), userData));
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns an attendee based on it's email.
     * 
     * @param email string
     * @param stripSensitive boolean
     * @return Promise<Attendee>
     */
    public async getByEmail(email: string, stripSensitive = false): Promise<Attendee> {
        try {
            let data = (await this.filter({email}) as UserMapping[]).pop();
            if (stripSensitive) {
                data = this.stripSensitiveInfo(data);
            }
            return this.mapper.hydrate(new Attendee(), data);
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns an attendee based on it's id.
     * 
     * @param id string
     * @return Promise<Attendee>
     */
    public async getById(id: string): Promise<Attendee> {
        try {
            const data = await this.get(id) as UserMapping;
            return this.mapper.hydrate(new Attendee(), this.stripSensitiveInfo(data));
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns an array of attendees based on their role.
     * 
     * @param role string
     * @return Promise<Attendee[]>
     */
    public async getAttendeesByRole(role: string): Promise<Attendee[]> {
        try {
            const data = await this.filter(r.row('roles').contains(role)) as UserMapping[];
            return data.map(item => this.mapper.hydrate(new Attendee(), this.stripSensitiveInfo(item)));
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns an array of attendees based on ids.
     * 
     * @param ids string[]
     * @return Promise<Attendee[]>
     */
    public async getAllByIds(ids: string[]): Promise<Attendee[]> {
        try {
            const data = await super.getAllByIds(ids) as UserMapping[];
            return data.map(item => this.mapper.hydrate(new Attendee(), item));
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
     * Returns a mapper
     * @return AttendeeMapper
     */
    public getMapper(): AttendeeMapper {
        return this.mapper;
    }
}

export const attendeeRepository = new AttendeeRepository();
