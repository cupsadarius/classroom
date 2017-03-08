import BaseRepository from './BaseRepository';
import {userRepository} from './UserRepository';
import {blacklistRepository} from './BlacklistRepository';

export const repos: {[key: string]: BaseRepository} = {
    userRepository,
    blacklistRepository,
};
