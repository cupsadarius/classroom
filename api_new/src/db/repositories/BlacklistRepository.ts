import BaseRepository from './BaseRepository';

export class BlacklistRepository extends BaseRepository {
    constructor() {
        super('blacklist');
    }
}

export const blacklistRepository = new BlacklistRepository();
