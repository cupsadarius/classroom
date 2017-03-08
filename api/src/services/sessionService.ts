import {db} from '../db';
import SessionRepository from '../db/repositories/SessionRepository';
import Session from '../models/Session';

export default class SessionService {

    constructor() {
    }


    public async getById(id: string) {
        try {
            return await this.getSessionRepository().getById(id);
        } catch (e) {
            throw e;
        }
    }

    public async getByIds(ids: string[]): Promise<Session[]> {
        try {
            return await this.getSessionRepository().getAllByIds(ids) as Promise<Session[]>;
        } catch (e) {
            throw e;
        }
    }

    private getSessionRepository(): SessionRepository {
        return db.getRepo('sessionRepository') as SessionRepository;
    }
}

export const sessionService = new SessionService();