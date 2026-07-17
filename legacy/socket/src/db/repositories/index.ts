import BaseRepository from './BaseRepository';
import {userRepository} from './UserRepository';
import {blacklistRepository} from './BlacklistRepository';
import {eventRepository} from './EventRepository';

export const repos: {[key: string]: BaseRepository} = {
    userRepository,
    blacklistRepository,
    eventRepository,
};
