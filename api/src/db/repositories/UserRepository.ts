import BaseRepository from './BaseRepository';

export class UserRepository extends BaseRepository {
    constructor() {
        super('users');
    }
}

export let userRepository = new UserRepository();
