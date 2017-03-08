import BaseRepository from './BaseRepository';
import Event from '../../models/Event';
import EventMapping from '../mappers/mappings/EventMapping';
import EventMapper from '../mappers/EventMapper';
import mapperFactory from '../mappers/MapperFactory';

export class EventRepository extends BaseRepository {

    private mapper: EventMapper;

    constructor() {
        super('events');
        this.mapper = mapperFactory.getMapper('Event') as EventMapper;
    }

    /**
     * Returns an array of events based on it's sessionId
     */
    public async getBySessionId(sessionId: string): Promise<Event[]> {
        try {
            const data = (await this.filter({sessionId}) as EventMapping[]);
            return data.map(item => this.mapper.hydrate(new Event(), item));
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns a event based on it's id.
     */
    public async getById(id: string): Promise<Event> {
        try {
            const data = await this.get(id) as EventMapping;
            return this.mapper.hydrate(new Event(), data);
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns an instance of the EventMapper.
     */
    public getMapper(): EventMapper {
        return this.mapper;
    }
}

export const eventRepository = new EventRepository();
