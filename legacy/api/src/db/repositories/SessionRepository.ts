import BaseRepository from './BaseRepository';
import mapperFactory from '../mappers/MapperFactory';
import SessionMapper from '../mappers/SessionMapper';
import SessionMapping from '../mappers/mappings/SessionMapping';
import Session from '../../models/Session';

export default class SessionRepository extends BaseRepository {
    private mapper: SessionMapper;
    constructor() {
        super('sessions');
        this.mapper = mapperFactory.getMapper('Session') as SessionMapper;
    }

    public async getById(id: string): Promise<Session> {
        try {
            const data = await super.get(id) as SessionMapping;
            return await this.mapper.hydrate(new Session(), data);
        } catch (e) {
            throw e;
        }
    }

    public async getByIds(ids: string[]) {
        try {
            const data: SessionMapping[] = await super.getAllByIds(ids) as SessionMapping[];
            const sessions = data.map(async item => await this.mapper.hydrate(new Session(), item));
            return Promise.all(sessions);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Returns an instance of the SessionMapper.
     */
    public getMapper(): SessionMapper {
        return this.mapper;
    }

}

export const sessionRepository = new SessionRepository();