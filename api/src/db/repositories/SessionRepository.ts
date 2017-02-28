import BaseRepository from './BaseRepository';

export default class SessionRepository extends BaseRepository {
    constructor() {
        super('sessions');
    }

}

export const sessionRepository = new SessionRepository();