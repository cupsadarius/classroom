import EventMapping from '../db/mappers/mappings/EventMapping';
import Event from '../models/Event';
import {db} from '../db';
import {EventRepository} from '../db/repositories/EventRepository';

export class EventService {

    public async saveEvent(event: Event) {
        try {
            const repo = this.getEventRepository();
            return await repo.insert(repo.getMapper().dehydrate(event));
        } catch (e) {
            throw e;
        }
    }

    public async getBySessionId(sessionId: string) {
        try {
            return await this.getEventRepository().getBySessionId(sessionId);
        } catch (e) {
            throw e;
        }
    }

    private getEventRepository(): EventRepository {
        return db.getRepo('EventRepository') as EventRepository;
    }
}

export const eventService = new EventService();